import { Box, Button, Container, Typography, TextField, InputAdornment, IconButton, Icon, FormControl, FormLabel, Radio, CircularProgress, RadioGroup, FormControlLabel } from "@mui/material";
import { ArrowBack, Create, Visibility, VisibilityOff } from "@mui/icons-material";
import React, { useEffect, useState } from "react";
import { supabase } from "../../SupabaseClient";
import styles from "./AuthPage.module.css";
import { useNavigate } from "react-router-dom";

function AuthPage() {
    // Auth states
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [isLogin, setIsLogin] = useState(true);
    const [showPassword, setShowPassword] = useState(false);
    const [step, setStep] = useState(0);
    const [username, setUsername] = useState("");
    const [role, setRole] = useState("");

    // Team states (shared for both join/create)
    const [teamNumber, setTeamNumber] = useState("");
    const [teamName, setTeamName] = useState("");
    const [rules, setRules] = useState("");

    const navigate = useNavigate();

    useEffect(() => {
        const checkSession = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            if (session) {
                const { data: profile, error: profileError } = await supabase
                    .from("profiles")
                    .select('team_id')
                    .eq('id', session.user.id)
                    .single();

                if (profileError && profileError.code === 'PGRST116') {
                    setStep(1); // If no profile, go to step 1
                    setError("");
                } else if (profile && !profile.team_id) {
                    setStep(2); // If profile exists but no team_id, go to step 2
                    setError("");
                } else if (profile && profile.team_id) {
                    navigate("/dashboard"); // If profile and team_id exist, navigate to dashboard
                    console.log("User already has a team, redirecting to dashboard.");
                } else {
                    setError("An unexpected error occurred while checking session.");
                }
            }
        };
        checkSession();
    }, [navigate]);

    const handleRegisterStep1 = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        try {
            const { data: { session } } = await supabase.auth.getSession();
            if (!session) {
                throw new Error("You must be logged in to create a profile.");
            }

            const { error } = await supabase
                .from("profiles")
                .insert([
                    {
                        id: session.user.id,
                        username: username,
                        role: role,
                        team_id: null,
                        spirit_dollars: 100 // Initially set to null, will be updated later
                    },
                ]);

            await supabase.auth.updateUser({
                data: { role: role }
            });

            if (error) {
                throw error;
            } else {
                setStep((prevStep) => prevStep + 1); // Move to next step
                setError("");
            }
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            if (!email || !password) {
                throw new Error("Email and password are required.");
            }
            if (isLogin) {
                // Login
                const { error } = await supabase.auth.signInWithPassword({
                    email: email,
                    password: password,
                });

                if (error) {
                    throw error;
                }
            } else {
                // Sign Up
                const { error } = await supabase.auth.signUp({
                    email: email,
                    password: password,
                });

                if (error) {
                    throw error;
                } else {
                    setStep((prevStep) => prevStep + 1); // Move to next step
                }
            }

            if (error) {
                throw error;
            } else {
                setEmail("");
                setPassword("");
                setError("");
            }
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }

    const toggleLoginSignup = () => {
        setIsLogin(!isLogin);
        setEmail("");
        setPassword("");
        setError("");
    };

    // --- Join Team logic ---
    const handleJoinTeam = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const { data: { session } } = await supabase.auth.getSession();
            if (!session) {
                throw new Error("You must be logged in to join a team.");
            }

            const parsedTeamNumber = parseInt(teamNumber, 10);
            if (!parsedTeamNumber || parsedTeamNumber <= 0) {
                setError("Please enter a valid team number.");
                setLoading(false);
                return;
            }

            const { data: team, error: teamError } = await supabase
                .from('teams')
                .select('id')
                .eq('number', parsedTeamNumber)
                .single();

            if (teamError || !team) {
                throw new Error("Team not found. Please check the team number and try again.");
            }

            const { error: joinError } = await supabase
                .from('profiles')
                .update({ team_id: team.id })
                .eq('id', session.user.id);

            if (joinError) {
                throw joinError;
            } else {
                setError("");
                alert("Successfully joined team #" + parsedTeamNumber);
                // navigate('/dashboard');
            }
        } catch (err) {
            setError(err.message || "Team not found. Please check the team number and try again.");
        } finally {
            setLoading(false);
        }
    };

    // --- Create Team logic ---
    const handleCreateTeam = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const { data: { session } } = await supabase.auth.getSession();
            if (!session) {
                throw new Error("You must be logged in to create a team.");
            }

            const parsedTeamNumber = parseInt(teamNumber, 10);
            if (!teamName || !parsedTeamNumber || parsedTeamNumber <= 0) {
                setError("Please enter a valid team name and number.");
                setLoading(false);
                return;
            }

            const { data: team, error: teamError } = await supabase
                .from('teams')
                .insert([{ name: teamName, number: parsedTeamNumber, rules: rules }])
                .select()
                .single();

            if (teamError || !team) {
                throw new Error("Failed to create team. Please try again.");
            }

            const { error: profileError } = await supabase
                .from('profiles')
                .update({ team_id: team.id })
                .eq('id', session.user.id);

            if (profileError) {
                throw profileError;
            } else {
                setError("");
                alert("Successfully created team #" + parsedTeamNumber);
                // navigate('/dashboard');
            }
        } catch (err) {
            setError(err.message || "Failed to create team. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    // --- UI ---
    return (
        <div className={styles.background}>
            { step === 0 ? (
            <Container maxWidth="sm" className="flex flex-col items-center justify-center min-h-screen">
                <Box className="w-full p-6 bg-white rounded-xl shadow-md">
                    <Typography variant="h4" component="h1" className="text-center mb-4">
                        {isLogin ? "Login" : "Sign Up"}
                    </Typography>
                    { error && error.length > 0 ? (
                        <Typography variant="body2" color="error" className="text-center mb-4">
                            {error}
                        </Typography>
                    ) : null }
                    <form onSubmit={handleSubmit}>
                        <TextField
                            label="Email"
                            variant="outlined"
                            fullWidth
                            id="email"
                            autoFocus
                            autoComplete="email"
                            margin="normal"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                        <TextField
                            label="Password"
                            variant="outlined"
                            fullWidth
                            id="password"
                            autoComplete="current-password"
                            margin="normal"
                            type={showPassword ? "text" : "password"}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            InputProps={{
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton
                                            aria-label="toggle password visibility"
                                            onClick={() => setShowPassword(!showPassword)}
                                            edge="end"
                                        >
                                            {showPassword ? <VisibilityOff /> : <Visibility />}
                                        </IconButton>
                                    </InputAdornment>
                                ),
                            }}
                        />
                        <Button variant="contained" type="submit" color="primary" fullWidth disabled={loading}>
                            {isLogin ? "Login" : "Sign Up"}
                        </Button>
                    </form>
                    <table className="w-full mt-4">
                        <tbody>
                            <tr>
                                <td><hr /></td>
                                <td className={styles.dividerLine}><p>OR</p></td>
                                <td><hr /></td>
                            </tr>
                        </tbody>
                    </table>
                    <Button variant="text" onClick={toggleLoginSignup} className="mt-2 text-center" fullWidth>
                        {isLogin ? "Don't have an account? Sign Up" : "Already have an account? Login"}
                    </Button>
                </Box>
            </Container>
            ) : null }
            { step === 1 ? (
            <Container maxWidth="sm" className="flex flex-col items-center justify-center min-h-screen">
                <Box className="w-full p-6 bg-white rounded-xl shadow-md">
                    <Typography variant="h4" component="h1" className="text-center mb-4">
                        Account Details
                    </Typography>
                    <Typography variant="body1" className="text-center mb-4">
                        Choose a username and role for your account.
                    </Typography>
                    <form onSubmit={handleRegisterStep1}>
                        <TextField
                            label="Username"
                            variant="outlined"
                            fullWidth
                            id="username"
                            autoFocus
                            margin="normal"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                        />
                        <FormControl fullWidth margin="normal" component="fieldset">
                            <FormLabel component="legend">Select Role</FormLabel>
                            <RadioGroup
                                row
                                aria-label="role"
                                name="role"
                                value={role}
                                onChange={(e) => setRole(e.target.value)}
                            >
                                <FormControlLabel value="student" control={<Radio />} label="Student" />
                                <FormControlLabel value="mentor" control={<Radio />} label="Mentor" />
                            </RadioGroup>
                        </FormControl>
                        { error && error.length > 0 ? (
                            <Typography variant="body2" color="error" className="text-center mb-4">
                                {error}
                            </Typography>
                        ) : null }
                        <Button variant="contained" type="submit" color="primary" fullWidth disabled={loading} sx={{ mt: 3, mb: 2}}>
                            {loading ? <CircularProgress size={24} /> : "Next" }
                        </Button>
                    </form>
                    <IconButton
                        className="absolute top-4 right-4"
                        onClick={() => setStep(0)}
                        aria-label="Back to Login/Sign Up"
                        size="small"
                    >
                        <ArrowBack />
                        Back
                    </IconButton>
                </Box>
            </Container>
            ) : null }

            { step === 2 ? (
                <Container maxWidth="sm" className="flex flex-col items-center justify-center min-h-screen">
                    <Box className="w-full p-6 bg-white rounded-xl shadow-md">
                        {/* Join Team Form */}
                        <form onSubmit={handleJoinTeam}>
                            <Typography variant="h4" component="h1" className="text-center mb-4">
                                Join a Team
                            </Typography>
                            <Typography variant="body2" className="text-center mt-2">
                                Enter the team number to join an existing team.
                            </Typography>
                            { error && error.length > 0 ? (
                                <Typography variant="body2" color="error" className="text-center mb-4">
                                    {error}
                                </Typography>
                            ) : null }
                            <TextField
                                label="Team #"
                                variant="outlined"
                                fullWidth
                                id="teamNumber"
                                margin="normal"
                                value={teamNumber}
                                onChange={(e) => setTeamNumber(e.target.value.replace(/\D/, ""))}
                                disabled={loading}
                            />
                            <Button
                                type="submit"
                                variant="contained"
                                color="primary"
                                fullWidth
                                disabled={loading}
                            >
                                Join Team
                            </Button>
                        </form>
                        {/* Mentor can also create a team */}
                        {role === 'mentor' && (
                            <>
                                <table className="w-full mt-4">
                                    <tbody>
                                        <tr>
                                            <td><hr /></td>
                                            <td className={styles.dividerLine}><p>OR</p></td>
                                            <td><hr /></td>
                                        </tr>
                                    </tbody>
                                </table>
                                <form onSubmit={handleCreateTeam}>
                                    <Typography variant="h4" component="h1" className="text-center mb-4">
                                        Create a Team
                                    </Typography>
                                    <Typography variant="body2" className="text-center mt-2">
                                        Enter the team details below.
                                    </Typography>
                                    <TextField
                                        label="Team Name"
                                        variant="outlined"
                                        fullWidth
                                        margin="normal"
                                        value={teamName}
                                        onChange={(e) => setTeamName(e.target.value)}
                                        required
                                        disabled={loading}
                                    />
                                    <TextField
                                        label="Team #"
                                        variant="outlined"
                                        fullWidth
                                        margin="normal"
                                        type="number"
                                        value={teamNumber}
                                        onChange={(e) => setTeamNumber(e.target.value.replace(/\D/, ""))}
                                        required
                                        disabled={loading}
                                    />
                                    <TextField
                                        label="Rules"
                                        variant="outlined"
                                        fullWidth
                                        margin="normal"
                                        value={rules}
                                        onChange={(e) => setRules(e.target.value)}
                                        multiline
                                        rows={4}
                                        disabled={loading}
                                    />
                                    <Button
                                        type="submit"
                                        variant="contained"
                                        color="primary"
                                        fullWidth
                                        disabled={loading}
                                    >
                                        Create Team
                                    </Button>
                                </form>
                            </>
                        )}
                    </Box>
                </Container>
            ) : null }
        </div>
    );
}

export default AuthPage;