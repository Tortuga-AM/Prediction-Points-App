// src/App.jsx
// Bumper Bias Project
import React, { useEffect } from 'react';
import AuthPage from './Pages/Auth/AuthPage';
import { Routes, Route, useNavigate } from 'react-router-dom';
import DashboardLayout from './Components/Dashboard/DashboardLayout';
import { supabase } from './SupabaseClient';
import SpinnerLoader from './Components/SpinnerLoader/SpinnerLoader';
import StudentDash from './Pages/Dashboard/StudentDash';
import MentorDash from './Pages/Dashboard/MentorDash';
import Redirector from './Components/Redirector/Redirector';

function App() {
    const [session, setSession] = React.useState(null);
    const [user, setUser] = React.useState(null);
    const [loading, setLoading] = React.useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const checkUserAndProfile = async (currentSession) => {
            setSession(currentSession);
            if (!currentSession) {
                setUser(null);
                if (location.pathname !== '/') {
                  navigate('/');
                }
                setLoading(false);
                return;
            }

            const { data: userProfile, error } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', currentSession.user.id)
                .single();

            if (error) {
                console.error("Error fetching user profile:", error);
                setUser(null);
                if (location.pathname !== '/'){
                  navigate('/');
                } // Redirect to AuthPage if error fetching profile
            } else {
                setUser(userProfile);
                if (!userProfile.team_id) {
                  if (location.pathname !== '/') {
                    navigate('/');
                  }
                } else {
                  if (location.pathname === '/') {
                    navigate('/dashboard')
                  }
                }
            }
            setLoading(false);
        };

        const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, currentSession) => {
            setSession(currentSession);
            checkUserAndProfile(currentSession);
        });

        supabase.auth.getSession().then(({ data: { session: initialSession } }) => {
            checkUserAndProfile(initialSession);
        });

        return () => {
          if (subscription) {
            subscription.unsubscribe();
          }
        };
    }, [navigate]);

    if (loading) {
        return <SpinnerLoader />;
    }

    return (
        <div>
            <Routes>
                <Route path="/" element={<AuthPage />} />
                {session && user?.team_id ? (
                    <React.Fragment>
                        <Route path="/dashboard" element={<DashboardLayout profile={user}>
                            {user.role === 'student' ? (
                                <StudentDash />
                            ) : user.role === 'mentor' ? (
                                <MentorDash />
                            ) : (
                                <div>Unknown role</div>
                            )}
                        </DashboardLayout>} />
                        <Route path="/leaderboard" element={<DashboardLayout profile={user} />} />
                        <Route path="/settings" element={<DashboardLayout profile={user} />} />
                        <Route path="/bets" element={<DashboardLayout profile={user} />} />
                        <Route path="*" element={<Redirector auth={true} />} />
                    </React.Fragment>
                ) : (
                    <Route path="*" element={<Redirector auth={false} />} />
                )}
            </Routes>
        </div>
    );
}

export default App;