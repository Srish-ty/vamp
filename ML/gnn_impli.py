import firebase_admin
from firebase_admin import credentials, firestore
import math
import networkx as nx
import matplotlib.pyplot as plt
import torch
from torch_geometric.data import Data
from torch_geometric.utils import from_networkx
from torch_geometric.nn import GCNConv
import torch.nn.functional as F

# Initialize Firebase Admin SDK
cred = credentials.Certificate("/home/anirudh/Blood_reaper/blood-reaper-f7580-firebase-adminsdk-dwyff-21dae7f7ea.json")
firebase_admin.initialize_app(cred)
db = firestore.client()

# Retrieve all hospitals and labs (blood banks)
hospitals = db.collection('hospitals').stream()
labs = db.collection('labs').stream()

# Convert Firestore documents to a list of dictionaries
hospital_nodes = [{**doc.to_dict(), 'id': doc.id} for doc in hospitals]
lab_nodes = [{**doc.to_dict(), 'id': doc.id} for doc in labs]
all_nodes = hospital_nodes + lab_nodes

# Retrieve the requirements
requirements_doc = db.collection('requirements').document('wScZkEs2egfo4bVwu5wP').get()
requirements_data = requirements_doc.to_dict()
required_hospital_ref = requirements_data.get('hospital')
required_hospital_id = required_hospital_ref.id if required_hospital_ref else None
required_blood_types = requirements_data.get('demand', {})

# Define universal blood types
universal_donors = {'O-'}  # Universal donors
universal_acceptors = {'AB+'}  # Universal acceptors


# Function to calculate the distance between two locations (lat-long) using the Haversine formula
def calculate_distance(loc1, loc2):
    R = 6371e3  # Earth radius in meters
    phi1 = math.radians(loc1.latitude)
    phi2 = math.radians(loc2.latitude)
    delta_phi = math.radians(loc2.latitude - loc1.latitude)
    delta_lambda = math.radians(loc2.longitude - loc1.longitude)

    a = math.sin(delta_phi / 2) ** 2 + \
        math.cos(phi1) * math.cos(phi2) * \
        math.sin(delta_lambda / 2) ** 2
    c = 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))

    return R * c  # Distance in meters


# Function to calculate the availability score based on blood type availability
def calculate_availability_score(lab, required_blood_types):
    score = 0
    for blood_type, required_amount in required_blood_types.items():
        available_amount = lab.get('blood_inventory', {}).get(blood_type, 0)
        available_amount = int(available_amount) if isinstance(available_amount, str) else available_amount
        # Prioritize universal donors or acceptors
        if blood_type in universal_donors:
            score += available_amount * 1.5
        elif blood_type in universal_acceptors:
            score += available_amount * 1.2
        else:
            score += available_amount
    return score


# Build a graph where each node is connected to every other node with an edge representing distance
graph = {}
for node in all_nodes:
    node_id = node['id']
    node_location = node['location']
    graph[node_id] = {}

    for other_node in all_nodes:
        if node_id != other_node['id']:
            distance = calculate_distance(node_location, other_node['location'])
            graph[node_id][other_node['id']] = distance

# Create a feature matrix for nodes
node_features = []
for node in all_nodes:
    lat = node['location'].latitude
    lon = node['location'].longitude
    node_features.append([lat, lon])

node_features = torch.tensor(node_features, dtype=torch.float)

# Convert the NetworkX graph to PyTorch Geometric's format
G = nx.Graph()
for node in all_nodes:
    node_id = node['id']
    node_location = node['location']
    color = 'blue' if node in hospital_nodes else 'red'
    G.add_node(node_id, pos=(node_location.latitude, node_location.longitude), color=color)

for node_id, edges in graph.items():
    for other_id, distance in edges.items():
        G.add_edge(node_id, other_id, weight=distance)

# Convert to PyTorch Geometric Data object
data = from_networkx(G)
data.x = node_features

# Build a target tensor based on availability and distance for hospitals only
targets = []
for node in hospital_nodes:
    hospital_location = node['location']
    min_metric = float('inf')
    for lab in lab_nodes:
        lab_location = lab['location']
        distance = calculate_distance(hospital_location, lab_location)
        availability_score = calculate_availability_score(lab, required_blood_types)
        metric = distance / (availability_score + 1e-6)  # Avoid division by zero
        if metric < min_metric:
            min_metric = metric
    targets.append(min_metric)

# Convert targets to a tensor
target = torch.tensor(targets, dtype=torch.float).unsqueeze(1)


# Define the GNN model
class GCN(torch.nn.Module):
    def __init__(self, input_dim, hidden_dim, output_dim):
        super(GCN, self).__init__()
        self.conv1 = GCNConv(input_dim, hidden_dim)
        self.conv2 = GCNConv(hidden_dim, output_dim)

    def forward(self, x, edge_index, edge_weight=None):
        x = self.conv1(x, edge_index, edge_weight)
        x = F.relu(x)
        x = self.conv2(x, edge_index, edge_weight)
        return x


# Initialize the GNN model
input_dim = data.num_node_features
hidden_dim = 16
output_dim = 1
model = GCN(input_dim, hidden_dim, output_dim)
optimizer = torch.optim.Adam(model.parameters(), lr=0.01)


# Filter the output to include only hospital nodes
def filter_output_for_hospitals(out, hospital_nodes, all_nodes):
    hospital_indices = [i for i, node in enumerate(all_nodes) if node in hospital_nodes]
    return out[hospital_indices]


# Training loop
def train():
    model.train()
    optimizer.zero_grad()
    out = model(data.x, data.edge_index)

    # Filter the output to match the size of the target
    out_filtered = filter_output_for_hospitals(out, hospital_nodes, all_nodes)

    loss = F.mse_loss(out_filtered, target)
    loss.backward()
    optimizer.step()
    return loss.item()


# Train the model
for epoch in range(200):
    loss = train()
    if epoch % 10 == 0:
        print(f'Epoch {epoch}, Loss: {loss}')

# Evaluate the model
model.eval()
with torch.no_grad():
    out = model(data.x, data.edge_index)
    out_filtered = filter_output_for_hospitals(out, hospital_nodes, all_nodes)
    predicted_metric = out_filtered.squeeze()
    nearest_lab_index = torch.argmin(predicted_metric)
    nearest_lab_node = lab_nodes[nearest_lab_index]
    print(f"Nearest lab (based on GNN prediction): {nearest_lab_node['name']}")

# Create a visualization of the graph
pos = nx.get_node_attributes(G, 'pos')
node_colors = [G.nodes[node]['color'] for node in G.nodes]
edge_weights = nx.get_edge_attributes(G, 'weight')

plt.figure(figsize=(12, 8))
nx.draw(G, pos, with_labels=True, node_size=2000, node_color=node_colors, font_size=10, font_weight='bold')
nx.draw_networkx_edge_labels(G, pos, edge_labels=edge_weights)
plt.title('Hospital and Lab Network')
plt.show()
