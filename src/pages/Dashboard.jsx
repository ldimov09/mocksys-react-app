import { Box, Typography, Paper, Chip, Tooltip } from '@mui/material';
import { useAuth } from '../contexts/AuthContext';
import { Navigate } from 'react-router-dom';
import TransferForm from '../components/TransferForm';
import KeysModule from '../components/KeysModule';
import ItemManager from '../components/ItemManager';
import CompanyManager from '../components/CompanyManager';
import DevicesManager from '../components/DevicesManager';

export default function Dashboard() {
    const { user } = useAuth();

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    const parseStatus = (status) => {
        const statuses = {
            'enabled_active': {
                name: 'Enabled active',
                color: 'light',
                help: 'You have access to your account and are able to participate in transactions.',
            },
            'enabled_inactive': {
                name: 'Enabled inactive',
                color: 'warning',
                help: 'You have access to your account but are not able to participate in transactions.',
            },
            'disabled_inactive': {
                name: 'Disabled inactive',
                color: 'error',
                help: 'You don\'t have access to your account. Please log out.',
            },
        }

        return statuses[status];
    }

    return (
        <Box sx={{ mt: 4, px: 2 }}>
            {user ? (
                <>
                    <Typography variant="h4" gutterBottom>
                        Dashboard
                    </Typography>

                    <Paper elevation={3} sx={{ p: 3, maxWidth: 500 }}>
                        <Typography variant="h6">Welcome, {user.name}!</Typography>
                        <Chip color="secondary" label={"Balance: Ʉ" + Number(user.balance)?.toFixed(2)} sx={{ mr: 1 }}/>
                        <Chip label={"Role: " + user.role} sx={{ mr: 1 }}/>
                        <Tooltip title={parseStatus(user?.status)?.help}>
                            <Chip label={"Status: " + parseStatus(user?.status)?.name} color={parseStatus(user?.status)?.color} sx={{ mr: 1 }}/>
                        </Tooltip>
                    </Paper>

                    <Paper elevation={3} sx={{ p: 3, maxWidth: 500, mt: 3 }}>
                        <Typography variant="h6" gutterBottom>Transfer to another account</Typography>
                        <TransferForm />
                    </Paper>

                    <Paper elevation={3} sx={{ p: 3, maxWidth: 500, mt: 3 }}>
                        <Typography variant="h6" gutterBottom>Keys handling</Typography>
                            <KeysModule />
                    </Paper>

                    <Paper elevation={3} sx={{ p: 3, maxWidth: 500, mt: 3 }}>
                        <Typography variant="h6" gutterBottom>Items</Typography>
                        {user.role == "business" ? (
                            <>
                                <ItemManager />
                            </>
                        ) :
                            <>
                                <Typography variant="body1" gutterBottom>This account has to be a busiess one to have items.</Typography>
                            </>
                        }
                    </Paper>

                    <Paper elevation={3} sx={{ p: 3, maxWidth: 500, mt: 3 }}>
                        <Typography variant="h6" gutterBottom>Company</Typography>
                        {user.role == "business" ? (
                            <>
                                <CompanyManager />
                            </>
                        ) :
                            <>
                                <Typography variant="body1" gutterBottom>This account has to be a busiess one to have a company.</Typography>
                            </>
                        }
                    </Paper>

                    <Paper elevation={3} sx={{ p: 3, maxWidth: 500, mt: 3 }}>
                        <Typography variant="h6" gutterBottom>Devices</Typography>
                        {user.role == "business" ? (
                            <>
                                <DevicesManager />
                            </>
                        ) :
                            <>
                                <Typography variant="body1" gutterBottom>This account has to be a busiess one to have devices.</Typography>
                            </>
                        }
                    </Paper>
                </>
            ) : (
                <>
                    <Button color="inherit" component={Link} to="/login">
                        Login
                    </Button>
                </>
            )}
        </Box>
    );
}
