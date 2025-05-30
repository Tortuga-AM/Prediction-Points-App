import React, { useEffect, useState } from 'react';
import { supabase } from '../../SupabaseClient';
import { Box, CircularProgress, Icon, Table, TableContainer, Typography, TableHead, TableRow, TableCell, TableBody } from '@mui/material';
import styles from './leaderboardPage.module.css';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import WarningIcon from '@mui/icons-material/Warning';
import Paper from '@mui/material/Paper';

function LeaderboardPage({ profile }) {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [leaderboard, setLeaderboard] = useState([]);

    useEffect(() => {
        const getTeams = async () => {
            try {
                const { data, error } = await supabase
                    .from('profiles')
                    .select('id, username, spirit_dollars, role, team_id')
                    .eq('team_id', profile.team_id)
                    .order('spirit_dollars', { ascending: false });

                console.log("Querying profiles for team_id:", profile.team_id);
                console.log("Raw data received from Supabase for leaderboard:", data);
                console.log("Error from Supabase (if any):", error);

                if (!data) {
                    throw new Error("No people were found :(")
                } else if (error) {
                    throw error
                } else {
                    setLeaderboard(data)
                }
            } catch(err) {
                console.error("Issue loading leaderboard");
                setError(err.message || "An error occurred while loading the leaderboard.");
            } finally {
                setLoading(false);
            }
        };

        getTeams();
    }, [profile?.team_id]);

    return (
        <div>
            <Box
                className={styles.titleCard}
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexDirection: 'row',
                    px: { xs: 1, sm: 3, md: 6 },
                    py: { xs: 1, sm: 2, md: 4 },
                    gap: { xs: 2, sm: 3, md: 5 },
                    textAlign: 'center',
                    flexWrap: 'wrap',
                }}
            >
                <Box
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        minWidth: { xs: 48, sm: 60, md: 80 },
                        mr: { xs: 1, sm: 2, md: 3 },
                    }}
                >
                    <EmojiEventsIcon
                        sx={{
                            fontSize: { xs: 48, sm: 60, md: 80 },
                            color: 'white',
                        }}
                    />
                </Box>
                <Box
                    sx={{
                        minWidth: 0,
                        flex: 1,
                        textAlign: 'center',
                        wordBreak: 'break-word',
                        overflowWrap: 'break-word',
                    }}
                >
                    <div
                        style={{
                            fontWeight: 'bold',
                            lineHeight: 1,
                            color: '#fff',
                            fontSize: 'clamp(20px, 8vw, 48px)',
                            textAlign: 'center',
                            wordBreak: 'break-word',
                            overflowWrap: 'break-word',
                        }}
                    >
                        Leaderboard
                    </div>
                    <div
                        style={{
                            color: '#ccc',
                            marginTop: 6,
                            fontSize: 'clamp(12px, 4vw, 16px)',
                            textAlign: 'center',
                            wordBreak: 'break-word',
                            overflowWrap: 'break-word',
                        }}
                    >
                        Compete for the podium!
                    </div>
                </Box>
            </Box>
            <div className={styles.leaderboardContainer}>
                {loading ? (
                    <CircularProgress />
                ) : null}
                {error && error.length > 0 ? (
                    <Box
                        sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            mt: 2,
                            minHeight: 120,
                        }}
                    >
                        <WarningIcon color="error" sx={{ fontSize: 48, mb: 1 }} />
                        <Typography variant="h6" color="error" className={styles.errorMessage}>{error}</Typography>
                    </Box>
                ) : (
                    <TableContainer className={styles.leaderboardTable} component={Paper}>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Rank</TableCell>
                                    <TableCell align="left">Username</TableCell>
                                    <TableCell align="right">Spirit Dollars</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {leaderboard.map((item, idx) => {
                                    // Define colors for top 3
                                    let bgColor = '#e0e0e0'; // gray
                                    let color = '#333';
                                    let content = idx + 1;
                                    // If user has 0 spirit dollars, show skull and strikethrough username
                                    const isZero = Number(item.spirit_dollars) === 0;
                                    if (isZero) {
                                        bgColor = '#222';
                                        color = '#fff';
                                        content = <span role="img" aria-label="skull" style={{ fontSize: 22 }}>💀</span>;
                                    }
                                    if (idx === 0) {
                                        bgColor = '#FFD700'; // gold
                                        color = '#fff';
                                        content = <EmojiEventsIcon sx={{ color: '#fff', fontSize: 24 }} />;
                                    } else if (idx === 1) {
                                        bgColor = '#C0C0C0'; // silver
                                        color = '#333';
                                    } else if (idx === 2) {
                                        bgColor = '#CD7F32'; // bronze
                                        color = '#fff';
                                    }
                                    return (
                                        <TableRow key={item.id}>
                                            <TableCell>
                                                <Box
                                                    sx={{
                                                        width: 36,
                                                        height: 36,
                                                        borderRadius: '50%',
                                                        backgroundColor: bgColor,
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'center',
                                                        fontWeight: 'bold',
                                                        color: color,
                                                        fontSize: 18,
                                                        mx: 'auto',
                                                    }}
                                                >
                                                    {idx === 0 ? content : (idx + 1)}
                                                </Box>
                                            </TableCell>
                                            <TableCell>{item.username}</TableCell>
                                            <TableCell align="right">{item.spirit_dollars} SD</TableCell>
                                        </TableRow>
                                    );
                                })}
                            </TableBody>
                        </Table>
                    </TableContainer>
                )}
            </div>
        </div>
    )


}

export default LeaderboardPage;