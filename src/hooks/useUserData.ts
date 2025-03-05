import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/firebase/config";
import useAuth from "./useAuth";

interface UserData {
	firstName: string;
	lastName: string;
	avatar: string;
	role: "teacher" | "student";
	email: string;
	school: string;
}

const useUserData = () => {
	const [userData, setUserData] = useState<UserData | null>(null);
	const [loading, setLoading] = useState(true);
	const user = useAuth();

	useEffect(() => {
		const fetchUserData = async () => {
			if (!user) {
				setUserData(null);
				setLoading(false);
				return;
			}

			try {
				const userDoc = await getDoc(doc(db, "users", user.uid));
				if (userDoc.exists()) {
					setUserData(userDoc.data() as UserData);
				}
			} catch (error) {
				console.error("Error fetching user data:", error);
			} finally {
				setLoading(false);
			}
		};

		fetchUserData();
	}, [user]);

	return { userData, loading };
};

export default useUserData;
