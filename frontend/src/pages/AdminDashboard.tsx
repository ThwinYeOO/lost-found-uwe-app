import React, { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Avatar,
  IconButton,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  CircularProgress,
  Tabs,
  Tab,
  TextField,
  InputAdornment,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormControlLabel,
  Switch,
} from '@mui/material';
import {
  People as PeopleIcon,
  Inventory as InventoryIcon,
  Message as MessageIcon,
  TrendingUp as TrendingUpIcon,
  Search as SearchIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
  AdminPanelSettings as AdminIcon,
  Person as PersonIcon,
  Add as AddIcon,
} from '@mui/icons-material';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { getAdminDashboard, deleteUser, updateUserRole, updateUserStatus, deleteItem, getAllMessages, deleteMessage, getAllItems, createItem, updateItem } from '../services/firestore';
import { User, Item, Message, AdminDashboardData } from '../types';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`admin-tabpanel-${index}`}
      aria-labelledby={`admin-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

const AdminDashboard: React.FC = () => {
  const [dashboardData, setDashboardData] = useState<AdminDashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [tabValue, setTabValue] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [deleteDialog, setDeleteDialog] = useState<{ open: boolean; type: 'user' | 'item' | 'message'; id: string; name: string }>({
    open: false,
    type: 'user',
    id: '',
    name: ''
  });
  const [itemDialog, setItemDialog] = useState<{ open: boolean; mode: 'create' | 'edit'; item?: Item }>({
    open: false,
    mode: 'create'
  });
  const [itemForm, setItemForm] = useState({
    name: '',
    description: '',
    type: 'Lost' as 'Lost' | 'Found',
    locationLostFound: '',
    dateLostFound: '',
    status: 'Pending',
    phoneNumber: '',
    reportName: '',
    reportUserId: '',
    imageUrl: ''
  });
  const [messages, setMessages] = useState<Message[]>([]);

  useEffect(() => {
    loadDashboardData();
    loadMessages();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const data = await getAdminDashboard();
      setDashboardData(data);
    } catch (err) {
      setError('Failed to load dashboard data');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const loadMessages = async () => {
    try {
      const data = await getAllMessages();
      setMessages(data);
    } catch (err) {
      console.error('Failed to load messages:', err);
    }
  };

  const handleDelete = async () => {
    try {
      if (deleteDialog.type === 'user') {
        await deleteUser(deleteDialog.id);
        await loadDashboardData();
      } else if (deleteDialog.type === 'item') {
        await deleteItem(deleteDialog.id);
        await loadDashboardData();
      } else if (deleteDialog.type === 'message') {
        await deleteMessage(deleteDialog.id);
        await loadMessages();
      }
      setDeleteDialog({ open: false, type: 'user', id: '', name: '' });
    } catch (err) {
      setError('Failed to delete item');
      console.error(err);
    }
  };

  const handleRoleChange = async (userId: string, newRole: 'user' | 'admin') => {
    try {
      await updateUserRole(userId, newRole);
      await loadDashboardData();
    } catch (err) {
      setError('Failed to update user role');
      console.error(err);
    }
  };

  const handleStatusChange = async (userId: string, isActive: boolean) => {
    try {
      await updateUserStatus(userId, isActive);
      await loadDashboardData();
    } catch (err) {
      setError('Failed to update user status');
      console.error(err);
    }
  };

  const handleItemFormChange = (field: string) => (event: any) => {
    setItemForm(prev => ({
      ...prev,
      [field]: event.target.value
    }));
  };

  const handleCreateItem = () => {
    setItemForm({
      name: '',
      description: '',
      type: 'Lost',
      locationLostFound: '',
      dateLostFound: '',
      status: 'Pending',
      phoneNumber: '',
      reportName: '',
      reportUserId: '',
      imageUrl: ''
    });
    setItemDialog({ open: true, mode: 'create' });
  };

  const handleEditItem = (item: Item) => {
    setItemForm({
      name: item.name,
      description: item.description,
      type: item.type as 'Lost' | 'Found',
      locationLostFound: item.locationLostFound,
      dateLostFound: item.dateLostFound ? new Date(item.dateLostFound).toISOString().split('T')[0] : '',
      status: item.status,
      phoneNumber: item.phoneNumber || '',
      reportName: item.reportName || '',
      reportUserId: item.reportUserId || '',
      imageUrl: item.imageUrl || ''
    });
    setItemDialog({ open: true, mode: 'edit', item });
  };

  const handleItemSubmit = async () => {
    try {
      const itemData = {
        ...itemForm,
        dateLostFound: itemForm.dateLostFound ? new Date(itemForm.dateLostFound) : new Date()
      };

      if (itemDialog.mode === 'create') {
        await createItem(itemData);
      } else if (itemDialog.mode === 'edit' && itemDialog.item) {
        await updateItem(itemDialog.item.id!, itemData);
      }

      setItemDialog({ open: false, mode: 'create' });
      await loadDashboardData();
    } catch (error) {
      console.error('Error saving item:', error);
      setError(error instanceof Error ? error.message : 'Failed to save item');
    }
  };

  const filteredUsers = dashboardData?.stats.recentUsers.filter(user =>
    user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.uweId.toLowerCase().includes(searchQuery.toLowerCase())
  ) || [];

  const filteredItems = dashboardData?.stats.recentItems.filter(item =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.locationLostFound.toLowerCase().includes(searchQuery.toLowerCase())
  ) || [];

  const filteredMessages = messages.filter(message =>
    message.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
    message.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
    message.senderName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    message.recipientName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box p={3}>
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  if (!dashboardData) {
    return (
      <Box p={3}>
        <Alert severity="info">No data available</Alert>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Admin Dashboard
      </Typography>

      {/* Statistics Cards */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center">
                <PeopleIcon color="primary" sx={{ mr: 2, fontSize: 40 }} />
                <Box>
                  <Typography color="textSecondary" gutterBottom>
                    Total Users
                  </Typography>
                  <Typography variant="h4">
                    {dashboardData.stats.totalUsers}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center">
                <InventoryIcon color="secondary" sx={{ mr: 2, fontSize: 40 }} />
                <Box>
                  <Typography color="textSecondary" gutterBottom>
                    Total Items
                  </Typography>
                  <Typography variant="h4">
                    {dashboardData.stats.totalItems}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center">
                <MessageIcon color="success" sx={{ mr: 2, fontSize: 40 }} />
                <Box>
                  <Typography color="textSecondary" gutterBottom>
                    Total Messages
                  </Typography>
                  <Typography variant="h4">
                    {dashboardData.stats.totalMessages}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center">
                <TrendingUpIcon color="warning" sx={{ mr: 2, fontSize: 40 }} />
                <Box>
                  <Typography color="textSecondary" gutterBottom>
                    Active Users
                  </Typography>
                  <Typography variant="h4">
                    {dashboardData.stats.activeUsers}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Charts */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Items by Month
            </Typography>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={dashboardData.chartData.itemsByMonth}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="lost" stroke="#8884d8" name="Lost Items" />
                <Line type="monotone" dataKey="found" stroke="#82ca9d" name="Found Items" />
              </LineChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Users by Month
            </Typography>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={dashboardData.chartData.usersByMonth}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>
      </Grid>

      {/* Management Tabs */}
      <Paper sx={{ width: '100%' }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={tabValue} onChange={(e, newValue) => setTabValue(newValue)}>
            <Tab label="Users" />
            <Tab label="Items" />
            <Tab label="Messages" />
          </Tabs>
        </Box>

        {/* Search Bar */}
        <Box sx={{ p: 2 }}>
          <TextField
            fullWidth
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
          />
        </Box>

        {/* Users Tab */}
        <TabPanel value={tabValue} index={0}>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>User</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>UWE ID</TableCell>
                  <TableCell>Role</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredUsers.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>
                      <Box display="flex" alignItems="center">
                        <Avatar src={user.avatar} sx={{ mr: 2 }}>
                          {user.name.charAt(0)}
                        </Avatar>
                        {user.name}
                      </Box>
                    </TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>{user.uweId}</TableCell>
                    <TableCell>
                      <Chip
                        icon={user.role === 'admin' ? <AdminIcon /> : <PersonIcon />}
                        label={user.role || 'user'}
                        color={user.role === 'admin' ? 'primary' : 'default'}
                        size="small"
                        onClick={() => handleRoleChange(user.id!, user.role === 'admin' ? 'user' : 'admin')}
                      />
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={user.isActive !== false ? 'Active' : 'Inactive'}
                        color={user.isActive !== false ? 'success' : 'error'}
                        size="small"
                        onClick={() => handleStatusChange(user.id!, !user.isActive)}
                      />
                    </TableCell>
                    <TableCell>
                      <IconButton
                        color="error"
                        onClick={() => setDeleteDialog({
                          open: true,
                          type: 'user',
                          id: user.id!,
                          name: user.name
                        })}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </TabPanel>

        {/* Items Tab */}
        <TabPanel value={tabValue} index={1}>
          <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h6">Items Management</Typography>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={handleCreateItem}
              sx={{ borderRadius: 2 }}
            >
              Add New Item
            </Button>
          </Box>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Item</TableCell>
                  <TableCell>Type</TableCell>
                  <TableCell>Location</TableCell>
                  <TableCell>Date</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredItems.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>
                      <Box>
                        <Typography variant="subtitle2">{item.name}</Typography>
                        <Typography variant="body2" color="textSecondary">
                          {item.description}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={item.type}
                        color={item.type === 'Lost' ? 'error' : 'success'}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>{item.locationLostFound}</TableCell>
                    <TableCell>
                      {item.dateLostFound ? new Date(item.dateLostFound).toLocaleDateString() : 'N/A'}
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={item.status}
                        color={item.status === 'Resolved' ? 'success' : 'default'}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', gap: 1 }}>
                        <IconButton
                          color="primary"
                          onClick={() => handleEditItem(item)}
                          size="small"
                        >
                          <EditIcon />
                        </IconButton>
                        <IconButton
                          color="error"
                          onClick={() => setDeleteDialog({
                            open: true,
                            type: 'item',
                            id: item.id!,
                            name: item.name
                          })}
                          size="small"
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </TabPanel>

        {/* Messages Tab */}
        <TabPanel value={tabValue} index={2}>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>From</TableCell>
                  <TableCell>To</TableCell>
                  <TableCell>Subject</TableCell>
                  <TableCell>Date</TableCell>
                  <TableCell>Read</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredMessages.map((message) => (
                  <TableRow key={message.id}>
                    <TableCell>{message.senderName}</TableCell>
                    <TableCell>{message.recipientName}</TableCell>
                    <TableCell>
                      <Typography variant="subtitle2">{message.subject}</Typography>
                      <Typography variant="body2" color="textSecondary" noWrap>
                        {message.content}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      {message.timestamp ? new Date(message.timestamp).toLocaleDateString() : 'N/A'}
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={message.read ? 'Read' : 'Unread'}
                        color={message.read ? 'success' : 'warning'}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      <IconButton
                        color="error"
                        onClick={() => setDeleteDialog({
                          open: true,
                          type: 'message',
                          id: message.id!,
                          name: message.subject
                        })}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </TabPanel>
      </Paper>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialog.open} onClose={() => setDeleteDialog({ open: false, type: 'user', id: '', name: '' })}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete this {deleteDialog.type}: <strong>{deleteDialog.name}</strong>?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialog({ open: false, type: 'user', id: '', name: '' })}>
            Cancel
          </Button>
          <Button onClick={handleDelete} color="error" variant="contained">
            Delete
          </Button>
        </DialogActions>
        </Dialog>

        {/* Item Form Dialog */}
        <Dialog 
          open={itemDialog.open} 
          onClose={() => setItemDialog({ open: false, mode: 'create' })}
          maxWidth="md"
          fullWidth
          PaperProps={{
            sx: {
              borderRadius: 3,
              boxShadow: '0 20px 60px rgba(0, 0, 0, 0.15)',
            }
          }}
        >
          <DialogTitle sx={{ 
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white',
            textAlign: 'center',
            py: 3,
            fontSize: '1.5rem',
            fontWeight: 700,
          }}>
            {itemDialog.mode === 'create' ? 'Create New Item' : 'Edit Item'}
          </DialogTitle>
          <DialogContent sx={{ p: 4 }}>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Item Name"
                  value={itemForm.name}
                  onChange={handleItemFormChange('name')}
                  variant="outlined"
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth required>
                  <InputLabel>Type</InputLabel>
                  <Select
                    value={itemForm.type}
                    onChange={handleItemFormChange('type')}
                    label="Type"
                  >
                    <MenuItem value="Lost">Lost</MenuItem>
                    <MenuItem value="Found">Found</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Description"
                  value={itemForm.description}
                  onChange={handleItemFormChange('description')}
                  variant="outlined"
                  multiline
                  rows={3}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Location"
                  value={itemForm.locationLostFound}
                  onChange={handleItemFormChange('locationLostFound')}
                  variant="outlined"
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Date"
                  type="date"
                  value={itemForm.dateLostFound}
                  onChange={handleItemFormChange('dateLostFound')}
                  variant="outlined"
                  InputLabelProps={{ shrink: true }}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>Status</InputLabel>
                  <Select
                    value={itemForm.status}
                    onChange={handleItemFormChange('status')}
                    label="Status"
                  >
                    <MenuItem value="Pending">Pending</MenuItem>
                    <MenuItem value="Resolved">Resolved</MenuItem>
                    <MenuItem value="Claimed">Claimed</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Contact Phone"
                  value={itemForm.phoneNumber}
                  onChange={handleItemFormChange('phoneNumber')}
                  variant="outlined"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Reporter Name"
                  value={itemForm.reportName}
                  onChange={handleItemFormChange('reportName')}
                  variant="outlined"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Reporter User ID"
                  value={itemForm.reportUserId}
                  onChange={handleItemFormChange('reportUserId')}
                  variant="outlined"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Image URL"
                  value={itemForm.imageUrl}
                  onChange={handleItemFormChange('imageUrl')}
                  variant="outlined"
                  placeholder="https://example.com/image.jpg"
                />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions sx={{ p: 3, gap: 2 }}>
            <Button
              onClick={() => setItemDialog({ open: false, mode: 'create' })}
              variant="outlined"
              sx={{ borderRadius: 2 }}
            >
              Cancel
            </Button>
            <Button
              onClick={handleItemSubmit}
              variant="contained"
              sx={{
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                borderRadius: 2,
                '&:hover': {
                  background: 'linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%)',
                },
              }}
            >
              {itemDialog.mode === 'create' ? 'Create Item' : 'Update Item'}
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    );
  };

  export default AdminDashboard;
