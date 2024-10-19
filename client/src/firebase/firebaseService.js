import { initializeApp } from "firebase/app";
import { getFirestore, doc, getDoc, setDoc } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBVcqlrSqJC25339hzsx6AWjBkQiq3RiK8",
  authDomain: "buidl-and-borrow-dapp.firebaseapp.com",
  projectId: "buidl-and-borrow-dapp",
  storageBucket: "buidl-and-borrow-dapp.appspot.com",
  messagingSenderId: "977347810732",
  appId: "1:977347810732:web:e4e77d7cd59d6b9240d609",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// ************ Fetch Loan Data from Firebase ************
export const fetchLoanData = async (accountAddress) => {
  const docRef = doc(db, "loans", accountAddress);
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    return docSnap.data();
  } else {
    console.log("No loan data found for account:", accountAddress);
    return null;
  }
};

// ************ Save Loan Data to Firebase (used when loan is issued) ************
export const saveLoanData = async (accountAddress, loanAmount, status = "unpaid") => {
  try {
    await setDoc(doc(db, "loans", accountAddress), {
      loanAmount: loanAmount,
      status: status,
    });
    console.log("Loan data saved for account:", accountAddress);
  } catch (e) {
    console.error("Error saving loan data: ", e);
  }
};