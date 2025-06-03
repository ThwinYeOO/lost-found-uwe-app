import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Grid,
  MenuItem,
  Box,
  Typography,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers';

interface LostItemFormProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: LostItemData) => void;
}

export interface LostItemData {
  itemName: string;
  category: string;
  location: string;
  dateLost: Date;
  description: string;
  contactInfo: string;
  status: string;
}

const categories = [
  'Electronics',
  'Clothing',
  'Books',
  'Accessories',
  'Documents',
  'Other'
];

const locations = [
  'Frenchay Campus',
  'Glenside Campus',
  'City Campus',
  'Bower Ashton Campus',
  'Other'
];

const LostItemForm: React.FC<LostItemFormProps> = ({ open, onClose, onSubmit }) => {
  const [formData, setFormData] = useState<LostItemData>({
    itemName: '',
    category: '',
    description: '',
    location: '',
    dateLost: new Date(),
    contactInfo: '',
    status: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleDateChange = (date: Date | null) => {
    if (date) {
      setFormData((prev) => ({
        ...prev,
        dateLost: date,
      }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        <Typography variant="h5" component="div">
          Report Lost Item
        </Typography>
      </DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                label="Item Name"
                name="itemName"
                value={formData.itemName}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                select
                label="Category"
                name="category"
                value={formData.category}
                onChange={handleChange}
              >
                {categories.map((category) => (
                  <MenuItem key={category} value={category}>
                    {category}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                select
                label="Location"
                name="location"
                value={formData.location}
                onChange={handleChange}
              >
                {locations.map((location) => (
                  <MenuItem key={location} value={location}>
                    {location}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                multiline
                rows={4}
                label="Description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Please provide detailed description of your lost item..."
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <DatePicker
                label="Date Lost"
                value={formData.dateLost}
                onChange={handleDateChange}
                slotProps={{
                  textField: {
                    fullWidth: true,
                    required: true,
                  },
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                label="Contact Info"
                name="contactInfo"
                value={formData.contactInfo}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                label="Status"
                name="status"
                value={formData.status}
                onChange={handleChange}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Cancel</Button>
          <Button type="submit" variant="contained" color="primary">
            Submit Report
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default LostItemForm; 