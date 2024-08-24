import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "./config";
import { addDoc, collection, GeoPoint } from "firebase/firestore";

export const registerUser = async (email, password) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    // Registered user data
    return {
      success: true,
      user: userCredential.user,
    };
  } catch (error) {
    console.error("Error registering user: ", error.message);
    return {
      success: false,
      error: error.message,
    };
  }
};

// Function to add hospital to Firestore
export const addHospitalToFirestore = async (hospitalData) => {
  try {
    const hospitalRef = collection(db, "hospitals");
    await addDoc(hospitalRef, {
      ...hospitalData,
      location: new GeoPoint(
        hospitalData.location.latitude,
        hospitalData.location.longitude
      ),
    });
    console.log("Hospital registered successfully!");
  } catch (error) {
    console.error("Error registering hospital: ", error);
    throw new Error("Error registering hospital");
  }
};

export const registerLab = async (labData) => {
  try {
    const labsCollection = collection(db, "labs");
    const docRef = await addDoc(labsCollection, labData);
    return docRef.id;
  } catch (error) {
    console.error("Error adding lab: ", error);
    throw new Error("Failed to register lab");
  }
};
