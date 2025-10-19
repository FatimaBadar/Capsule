import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Button, 
  Grid, 
  Card, 
  CardContent, 
  Chip, 
  CircularProgress,
  Alert,
  Paper,
  Divider
} from '@mui/material';
import { useAuth } from '../contexts/AuthContext.jsx';
import axios from 'axios';

const API_URL = import.meta.env.VITE_SERVER_API_BASE_URL || 'http://localhost:3001';

const OutfitSuggestionComponent = () => {
  const { user } = useAuth();
  const [selectedStyle, setSelectedStyle] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(false);
  const [outfits, setOutfits] = useState([]);
  const [message, setMessage] = useState({ text: '', type: '' });
  const [weatherLoading, setWeatherLoading] = useState(true);

  const styleOptions = [
    'Casual', 'Business', 'Athletic', 'Evening', 'Beach', 'Formal', 'Streetwear', 'Minimalist'
  ];

  const colorOptions = [
    { name: 'Black', value: '#000000' },
    { name: 'White', value: '#FFFFFF' },
    { name: 'Gray', value: '#808080' },
    { name: 'Brown', value: '#964B00' },
    { name: 'Blue', value: '#0000FF' },
    { name: 'Red', value: '#FF0000' },
    { name: 'Green', value: '#008000' },
    { name: 'Yellow', value: '#FFFF00' },
    { name: 'Purple', value: '#800080' },
    { name: 'Orange', value: '#FFA500' },
    { name: 'Pink', value: '#FFC0CB' },
    { name: 'Maroon', value: '#A52A2A' },
    { name: 'Cyan', value: '#00FFFF' },
    { name: 'Indigo', value: '#4B0082' },
    { name: 'Gold', value: '#FFD700' },
    { name: 'Silver', value: '#C0C0C0' }
  ];

  const getWeatherIcon = (condition) => {
    const icons = {
      'Clear': '☀️',
      'Clouds': '☁️',
      'Rain': '🌧️',
      'Drizzle': '🌦️',
      'Thunderstorm': '⛈️',
      'Snow': '❄️',
      'Mist': '🌫️',
      'Fog': '🌫️',
      'Haze': '🌫️'
    };
    return icons[condition] || '🌤️';
  };

  const fetchWeatherData = async () => {
    try {
      setWeatherLoading(true);
      // Using a fallback weather API or mock data
      // In production, you would use a real weather API
      const mockWeather = {
        temperature: 18,
        description: 'Partly Cloudy',
        condition: 'Clouds',
        city: 'Auckland'
      };
      
      setWeather(mockWeather);
    } catch (error) {
      console.error('Weather fetch error:', error);
      setWeather({
        temperature: 20,
        description: 'Sunny',
        condition: 'Clear',
        city: 'Auckland'
      });
    } finally {
      setWeatherLoading(false);
    }
  };

  useEffect(() => {
    fetchWeatherData();
  }, []);

  const showMessage = (text, type = 'info') => {
    setMessage({ text, type });
  };

  const generateOutfits = async () => {
    if (!selectedStyle || !selectedColor) {
      showMessage('Please select both a style and color preference before generating an outfit.', 'error');
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(`${API_URL}/api/clothes/outfits/generate`, {
        style: selectedStyle.toLowerCase(),
        color: selectedColor,
        weather: weather?.description || 'Sunny',
        occasion: 'General',
        city: weather?.city || 'Auckland'
      }, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (response.data.statusCode === 200) {
        setOutfits(response.data.outfits);
        showMessage('Outfit suggestions generated successfully!', 'success');
      } else {
        showMessage('Failed to generate outfit suggestions. Please try again.', 'error');
      }
    } catch (error) {
      console.error('Outfit generation error:', error);
      showMessage('Failed to generate outfit suggestions. Please try again.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const saveOutfit = async (outfit) => {
    try {
      const response = await axios.post(`${API_URL}/api/clothes/outfits/save`, {
        outfit
      }, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (response.data.statusCode === 200) {
        showMessage(`Saved "${outfit.outfitTitle}" to your outfit history!`, 'success');
      }
    } catch (error) {
      console.error('Save outfit error:', error);
      showMessage('Failed to save outfit. Please try again.', 'error');
    }
  };

  const getItemIcon = (category) => {
    const icons = {
      't-shirt': '👕',
      'shirt': '👔',
      'jeans': '👖',
      'pants': '👖',
      'shorts': '🩳',
      'shoes': '👟',
      'jacket': '🧥',
      'hoodie': '🧥',
      'dress': '👗',
      'skirt': '👗',
      'sweater': '🧥',
      'blouse': '👔',
      'suit': '👔',
      'other': '👕'
    };
    return icons[category] || '👕';
  };

  return (
    <Box sx={{ 
      minHeight: '100vh', 
      // background: 'linear-gradient(180deg, #0A1F17, #1A3A2E, #2A5A3E)',
      color: '#fff',
      padding: '20px'
    }}>
      <Box sx={{ maxWidth: '1200px', margin: '0 auto' }}>
        <Typography variant="h3" sx={{ 
          textAlign: 'center', 
          marginBottom: '20px',
          fontWeight: 600,
          color: '#8FD3B4'
        }}>
          Create New Suggestion
        </Typography>
        
        <Typography variant="h6" sx={{ 
          textAlign: 'center', 
          marginBottom: '40px',
          color: '#8FD3B4'
        }}>
          Set your preferences to generate a personalized outfit
        </Typography>

        <Grid container spacing={4}>
          {/* Form Section */}
          <Grid item xs={12} md={6}>
            <Paper sx={{ 
              background: 'rgba(18, 42, 33, 0.9)',
              borderRadius: '12px',
              padding: '30px',
              border: '1px solid rgba(40, 90, 70, 0.3)'
            }}>
              {/* Weather Info */}
              <Box sx={{ 
                background: 'rgba(30, 65, 50, 0.7)',
                borderRadius: '10px',
                padding: '16px',
                marginBottom: '30px',
                display: 'flex',
                alignItems: 'center',
                gap: '15px'
              }}>
                <Typography sx={{ fontSize: '24px' }}>
                  {weatherLoading ? '⏳' : getWeatherIcon(weather?.condition)}
                </Typography>
                <Box>
                  <Typography variant="h6" sx={{ fontSize: '16px', fontWeight: 500, marginBottom: '4px' }}>
                    Current Weather - {weather?.city || 'Auckland'}
                  </Typography>
                  <Typography sx={{ color: '#8FD3B4', fontSize: '14px' }}>
                    {weatherLoading ? 'Loading weather data...' : `${weather?.description}, ${weather?.temperature}°C`}
                  </Typography>
                </Box>
              </Box>

              <Divider sx={{ margin: '24px 0', borderColor: 'rgba(255, 255, 255, 0.1)' }} />

              {/* Style Preference */}
              <Box sx={{ marginBottom: '30px' }}>
                <Typography variant="h5" sx={{ fontSize: '18px', fontWeight: 500, marginBottom: '12px' }}>
                  Style Preference
                </Typography>
                <Typography sx={{ color: '#8FD3B4', fontSize: '14px', marginBottom: '16px' }}>
                  Select a style
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: '12px', marginBottom: '24px' }}>
                  {styleOptions.map((style) => (
                    <Chip
                      key={style}
                      label={style}
                      onClick={() => setSelectedStyle(style)}
                      sx={{
                        background: selectedStyle === style ? 'rgba(50, 110, 85, 0.9)' : 'rgba(30, 65, 50, 0.7)',
                        border: selectedStyle === style ? '1px solid #8FD3B4' : '1px solid rgba(60, 120, 100, 0.4)',
                        color: '#fff',
                        cursor: 'pointer',
                        '&:hover': {
                          background: 'rgba(40, 85, 65, 0.8)'
                        }
                      }}
                    />
                  ))}
                </Box>
              </Box>

              {/* Color Preference */}
              <Box sx={{ marginBottom: '30px' }}>
                <Typography variant="h5" sx={{ fontSize: '18px', fontWeight: 500, marginBottom: '12px' }}>
                  Color Preference
                </Typography>
                <Typography sx={{ color: '#8FD3B4', fontSize: '14px', marginBottom: '16px' }}>
                  Select a color
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: '12px', marginBottom: '24px' }}>
                  {colorOptions.map((color) => (
                    <Box
                      key={color.name}
                      onClick={() => setSelectedColor(color.name)}
                      sx={{
                        width: '36px',
                        height: '36px',
                        borderRadius: '50%',
                        backgroundColor: color.value,
                        cursor: 'pointer',
                        border: selectedColor === color.name ? '2px solid #fff' : '2px solid transparent',
                        boxShadow: selectedColor === color.name ? '0 0 0 2px rgba(143, 211, 180, 0.5)' : 'none',
                        transition: 'transform 0.2s ease',
                        '&:hover': {
                          transform: 'scale(1.1)'
                        }
                      }}
                      title={color.name}
                    />
                  ))}
                </Box>
              </Box>

              {/* Generate Button */}
              <Button
                variant="contained"
                onClick={generateOutfits}
                disabled={loading || !selectedStyle || !selectedColor}
                sx={{
                  background: '#8FD3B4',
                  color: '#0A1F17',
                  borderRadius: '8px',
                  padding: '16px 24px',
                  fontSize: '16px',
                  fontWeight: 600,
                  width: '100%',
                  marginTop: '10px',
                  '&:hover': {
                    background: '#9FE3C4',
                    transform: 'translateY(-2px)'
                  },
                  '&:disabled': {
                    background: 'rgba(143, 211, 180, 0.3)',
                    color: 'rgba(10, 31, 23, 0.5)'
                  }
                }}
              >
                {loading ? <CircularProgress size={24} color="inherit" /> : 'Generate Outfit Suggestion'}
              </Button>

              {/* Message */}
              {message.text && (
                <Alert 
                  severity={message.type} 
                  sx={{ mt: 2, mb: 2 }}
                  onClose={() => setMessage({ text: '', type: '' })}
                >
                  {message.text}
                </Alert>
              )}
            </Paper>
          </Grid>

          {/* Results Section */}
          <Grid item xs={12} md={6}>
            <Paper sx={{ 
              background: 'rgba(18, 42, 33, 0.9)',
              borderRadius: '12px',
              padding: '30px',
              border: '1px solid rgba(40, 90, 70, 0.3)',
              height: 'fit-content'
            }}>
              <Typography variant="h5" sx={{ fontSize: '18px', fontWeight: 500, marginBottom: '20px' }}>
                Suggested Outfits
              </Typography>

              {outfits.length === 0 ? (
                <Typography sx={{ 
                  color: 'rgba(255, 255, 255, 0.5)', 
                  textAlign: 'center', 
                  fontSize: '14px',
                  fontStyle: 'italic'
                }}>
                  No outfits generated yet. Select your preferences and click "Generate Outfit Suggestion"
                </Typography>
              ) : (
                <Box>
                  {outfits.map((outfit, index) => (
                    <Card key={index} sx={{ 
                      background: 'rgba(30, 65, 50, 0.7)',
                      borderRadius: '10px',
                      marginBottom: '20px',
                      border: '1px solid rgba(60, 120, 100, 0.4)'
                    }}>
                      <CardContent>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                          <Typography variant="h6" sx={{ fontSize: '16px', fontWeight: 600 }}>
                            {outfit.outfitTitle}
                          </Typography>
                          <Typography sx={{ color: '#FFD166', fontSize: '14px' }}>
                            {'★'.repeat(outfit.styleRating || 4)}
                          </Typography>
                        </Box>

                        <Box sx={{ display: 'flex', gap: '15px', marginBottom: '15px' }}>
                          {outfit.items?.map((item, itemIndex) => (
                            <Box key={itemIndex} sx={{ flex: 1, textAlign: 'center' }}>
                              <Box sx={{
                                width: '60px',
                                height: '60px',
                                borderRadius: '8px',
                                margin: '0 auto 8px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: '24px',
                                backgroundColor: item.color || '#808080'
                              }}>
                                {getItemIcon(item.category)}
                              </Box>
                              <Typography sx={{ fontSize: '12px', color: '#8FD3B4' }}>
                                {item.name}
                              </Typography>
                            </Box>
                          ))}
                        </Box>

                        <Typography sx={{ fontSize: '14px', color: '#8FD3B4', marginBottom: '15px' }}>
                          {outfit.description}
                        </Typography>

                        <Box sx={{ display: 'flex', gap: '10px' }}>
                          <Button
                            variant="outlined"
                            size="small"
                            onClick={() => saveOutfit(outfit)}
                            sx={{
                              flex: 1,
                              background: 'rgba(143, 211, 180, 0.2)',
                              color: '#8FD3B4',
                              border: '1px solid rgba(143, 211, 180, 0.4)',
                              fontSize: '12px',
                              '&:hover': {
                                background: 'rgba(143, 211, 180, 0.3)'
                              }
                            }}
                          >
                            Save Outfit
                          </Button>
                          <Button
                            variant="outlined"
                            size="small"
                            sx={{
                              flex: 1,
                              background: 'rgba(255, 255, 255, 0.1)',
                              color: '#fff',
                              border: '1px solid rgba(255, 255, 255, 0.2)',
                              fontSize: '12px',
                              '&:hover': {
                                background: 'rgba(255, 255, 255, 0.2)'
                              }
                            }}
                          >
                            Share
                          </Button>
                        </Box>
                      </CardContent>
                    </Card>
                  ))}
                </Box>
              )}
            </Paper>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

export default OutfitSuggestionComponent;
