"use client";

import { authorize } from "@/api/auth";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";


export default function ProtectRoute({children}: {
    children: React.ReactNode
}) {

    const [isLoading, setIsLoading] = useState(true);

    const router = useRouter();

    const authorizeMutation = useMutation({
        mutationFn: authorize,
        onSuccess: (data) => {
            toast.success('Authorization success');
            setIsLoading(false);
        },
        onError: () => {
            toast.error('Authorization failed');
            router.replace('/');
        }
    });

    useEffect(() => {
        const storedToken = localStorage.getItem('token');

        if (!storedToken) {
            router.replace('/signin');
        } else {
            authorizeMutation.mutate({token: storedToken});
        }
        
        return () => setIsLoading(false);
    }, []);
    
    return (
        <>
            {children}
        </>
    );
}