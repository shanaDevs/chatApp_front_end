import React, { useState, useEffect } from "react";
import { Redirect } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";

function Index() {
    const [isLoading, setIsLoading] = useState(true);
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {
        checkUser();
    }, []);

    async function checkUser() {
        try {
            const user = await AsyncStorage.getItem("user");
            setIsLoggedIn(!!user);
        } catch (error) {
            console.error("Error checking user:", error);
            setIsLoggedIn(false);
        } finally {
            setIsLoading(false);
        }
    }

    if (isLoading) {
        return null; // or a loading component
    }

    if (isLoggedIn) {
        return <Redirect href="/(tabs)/Home" />;
    } else {
        return <Redirect href="/(tabs)/Signin" />;
    }
}

export default Index;
