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
    <Dialog 
      open={open} 
      onClose={onClose} 
      maxWidth="md" 
      fullWidth
      fullScreen={false}
      PaperProps={{
        sx: {
          margin: { xs: 1, sm: 'auto' },
          maxHeight: { xs: '95vh', sm: '90vh' },
          width: { xs: '100%', sm: 'auto' }
        }
      }}
    >
      <DialogTitle sx={{ pb: 1 }}>
        <Typography variant="h5" component="div" sx={{ fontSize: { xs: '1.25rem', sm: '1.5rem' } }}>
          Report Lost Item
        </Typography>
      </DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent sx={{ px: { xs: 2, sm: 3 }, pb: 1 }}>
          <Grid container spacing={{ xs: 2, sm: 3 }}>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                label="Item Name"
                name="itemName"
                value={formData.itemName}
                onChange={handleChange}
                inputProps={{
                  style: { fontSize: '16px' } // Prevents zoom on iOS
                }}
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
                inputProps={{
                  style: { fontSize: '16px' } // Prevents zoom on iOS
                }}
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
                inputProps={{
                  style: { fontSize: '16px' } // Prevents zoom on iOS
                }}
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
                inputProps={{
                  style: { fontSize: '16px' } // Prevents zoom on iOS
                }}
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
                inputProps={{
                  style: { fontSize: '16px' } // Prevents zoom on iOS
                }}
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
                inputProps={{
                  style: { fontSize: '16px' } // Prevents zoom on iOS
                }}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ 
          px: { xs: 2, sm: 3 }, 
          py: 2,
          flexDirection: { xs: 'column', sm: 'row' },
          gap: { xs: 1, sm: 2 }
        }}>
          <Button 
            onClick={onClose}
            fullWidth={false}
            sx={{ 
              minWidth: { xs: '100%', sm: 'auto' },
              minHeight: '48px',
              order: { xs: 2, sm: 1 }
            }}
          >
            Cancel
          </Button>
          <Button 
            type="submit" 
            variant="contained" 
            color="primary"
            fullWidth={false}
            sx={{ 
              minWidth: { xs: '100%', sm: 'auto' },
              minHeight: '48px',
              order: { xs: 1, sm: 2 }
            }}
          >
            Submit Report
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default LostItemForm; 