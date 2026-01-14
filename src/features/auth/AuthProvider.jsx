import { useEffect, useState } from 'react';

import { onAuthStateChanged } from 'firebase/auth';

import { auth } from './firebase'

import { AuthContext } from './context/AuthContext';

export function AuthProvider({ children }) {
    const [ user, setUser ] = useState(null);
    const [ authReady, setAuthReady ] = useState(false);

    useEffect(() => {
        const unsub = onAuthStateChanged(auth, (user) => {
            setUser(user);
            setAuthReady(true);
        })
        return () => unsub();
    }, []);

    return (
        <AuthContext.Provider value={{ user, authReady }}>
            {children}
        </AuthContext.Provider>
    );
}