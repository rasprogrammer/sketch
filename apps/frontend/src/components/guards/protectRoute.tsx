"use client";

import { authorize } from "@/api/auth";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import Spinner from "../spinner";


export default function ProtectRoute({children}: {
    children: React.ReactNode
}) {

    const [isLoading, setIsLoading] = useState(true);

    const router = useRouter();

    const authorizeMutation = useMutation({
        mutationFn: authorize,
        onSuccess: (data) => {
            // toast.success('Authorization success');
            setIsLoading(false);
        },
        onError: (err) => {
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

    if (isLoading || authorizeMutation.isPending) {
        return (
            <div className='bg-background_yellow flex h-screen items-center justify-center'>
                <div className='flex flex-col items-center space-y-4'>
                {/* Animated Spinner */}
                <Spinner />
                {/* Loading Text */}
                <p className='text-xl font-medium text-gray-700'>Verifying...</p>
                </div>
            </div>
        );
    }

    return (
        <>
            {children}
        </>
    );
}