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
  const [availableOptions, setAvailableOptions] = useState({
    colors: [],
    styles: [],
    occasions: [],
    weathers: []
  });
  const [allItems, setAllItems] = useState([]);
  const [suggestions, setSuggestions] = useState(null);

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

  const fetchAvailableOptions = async () => {
    if (!user) return;

    try {
      const response = await axios.get(`${API_URL}/api/clothes/get-all-clothes`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (response.data.items) {
        const items = response.data.items;
        
        // Store all items for filtering
        setAllItems(items);
        
        // Extract unique colors
        const colors = [...new Set(items.map(item => item.color).filter(Boolean))];
        
        // Extract unique styles (handle arrays)
        const styles = [...new Set(items.flatMap(item => 
          Array.isArray(item.style) ? item.style : [item.style]
        ).filter(Boolean))];
        
        // Extract unique occasions (handle arrays)
        const occasions = [...new Set(items.flatMap(item => 
          Array.isArray(item.occasion) ? item.occasion : [item.occasion]
        ).filter(Boolean))];
        
        // Extract unique seasons (handle arrays)
        const weathers = [...new Set(items.flatMap(item => 
          Array.isArray(item.seasonType) ? item.seasonType : [item.seasonType]
        ).filter(Boolean))];

        setAvailableOptions({
          colors: colors.sort(),
          styles: styles.sort(),
          occasions: occasions.sort(),
          weathers: weathers.sort()
        });
      }
    } catch (error) {
      console.error('Error fetching available options:', error);
    }
  };

  useEffect(() => {
    fetchWeatherData();
    if (user) {
      fetchAvailableOptions();
    }
  }, [user]);

  const showMessage = (text, type = 'info') => {
    setMessage({ text, type });
  };

  // Filter options based on current selections
  const getFilteredOptions = () => {
    let filteredItems = allItems;

    // Filter by color if selected
    if (selectedColor) {
      filteredItems = filteredItems.filter(item => item.color === selectedColor);
    }

    // Filter by style if selected
    if (selectedStyle) {
      filteredItems = filteredItems.filter(item => {
        const itemStyles = Array.isArray(item.style) ? item.style : [item.style];
        return itemStyles.includes(selectedStyle);
      });
    }

    // Extract available options from filtered items
    const availableColors = [...new Set(filteredItems.map(item => item.color).filter(Boolean))];
    const availableStyles = [...new Set(filteredItems.flatMap(item => 
      Array.isArray(item.style) ? item.style : [item.style]
    ).filter(Boolean))];

    return {
      colors: availableColors.sort(),
      styles: availableStyles.sort()
    };
  };

  const handleColorChange = (color) => {
    setSelectedColor(color);
    // Reset style when color changes
    setSelectedStyle('');
  };

  const handleStyleChange = (style) => {
    setSelectedStyle(style);
  };

  const generateOutfits = async () => {
    if (!selectedStyle || !selectedColor) {
      showMessage('Please select both a style and color preference before generating an outfit.', 'error');
      return;
    }

    setLoading(true);
    try {
      const preferences = {
        color: selectedColor,
        style: selectedStyle
      };
      
      const weatherType = weather ? getWeatherSeason(weather.temperature) : 'all-season';
      
      const response = await axios.post(`${API_URL}/api/clothes/suggestions`, {
        preferences,
        weather: weatherType,
        occasion: 'General'
      }, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (response.data.suggestions) {
        setSuggestions(response.data.suggestions);
        setOutfits([]); // Clear old AI outfits
        showMessage('Outfit suggestions generated successfully!', 'success');
      } else {
        showMessage('No suggestions found matching your criteria', 'warning');
        setSuggestions(null);
      }
    } catch (error) {
      console.error('Outfit generation error:', error);
      showMessage('Failed to generate outfit suggestions. Please try again.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const getWeatherSeason = (temperature) => {
    if (temperature < 10) return 'winter';
    if (temperature < 20) return 'spring';
    if (temperature < 30) return 'fall';
    return 'summer';
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
      'accessories': '👜',
      'other': '👕'
    };
    return icons[category] || '👕';
  };

  const getColorValue = (colorName) => {
    const colorMap = {
      'black': '#000000',
      'white': '#FFFFFF',
      'gray': '#808080',
      'grey': '#808080',
      'brown': '#964B00',
      'blue': '#0000FF',
      'red': '#FF0000',
      'green': '#008000',
      'yellow': '#FFFF00',
      'purple': '#800080',
      'orange': '#FFA500',
      'pink': '#FFC0CB',
      'maroon': '#A52A2A',
      'cyan': '#00FFFF',
      'indigo': '#4B0082',
      'gold': '#FFD700',
      'silver': '#C0C0C0',
      'navy': '#000080',
      'beige': '#F5F5DC',
      'tan': '#D2B48C'
    };
    return colorMap[colorName.toLowerCase()] || '#808080';
  };

  const getImageSrc = (item) => {
    // First try imageBase64 if it's already a string
    if (item.imageBase64 && typeof item.imageBase64 === 'string') {
      return item.imageBase64;
    }
    
    // If imageBase64 is a Buffer object, convert it using browser-compatible method
    if (item.imageBase64 && item.imageBase64.data && item.imageBase64.contentType) {
      const uint8Array = new Uint8Array(item.imageBase64.data);
      const binaryString = Array.from(uint8Array, byte => String.fromCharCode(byte)).join('');
      const base64 = btoa(binaryString);
      return `data:${item.imageBase64.contentType};base64,${base64}`;
    }
    
    // If image field exists with Buffer data, convert it
    if (item.image && item.image.data && item.image.contentType) {
      const uint8Array = new Uint8Array(item.image.data);
      const binaryString = Array.from(uint8Array, byte => String.fromCharCode(byte)).join('');
      const base64 = btoa(binaryString);
      return `data:${item.image.contentType};base64,${base64}`;
    }
    
    // Fallback to imageUrl
    if (item.imageUrl) {
      return `${API_URL}${item.imageUrl}`;
    }
    
    // Return empty string if no image data
    return '';
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
              // background: 'rgba(18, 42, 33, 0.9)',
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
                  {getFilteredOptions().styles.length > 0 ? (
                    getFilteredOptions().styles.map((style) => (
                      <Chip
                        key={style}
                        label={style}
                        onClick={() => handleStyleChange(style)}
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
                    ))
                  ) : (
                    <Typography sx={{ color: '#8FD3B4', fontStyle: 'italic' }}>
                      {selectedColor ? `No styles available for ${selectedColor} items` : 'No styles available in your wardrobe'}
                    </Typography>
                  )}
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
                  {getFilteredOptions().colors.length > 0 ? (
                    getFilteredOptions().colors.map((color) => (
                      <Box
                        key={color}
                        onClick={() => handleColorChange(color)}
                        sx={{
                          width: '36px',
                          height: '36px',
                          borderRadius: '50%',
                          backgroundColor: getColorValue(color),
                          cursor: 'pointer',
                          border: selectedColor === color ? '2px solid #fff' : '2px solid transparent',
                          boxShadow: selectedColor === color ? '0 0 0 2px rgba(143, 211, 180, 0.5)' : 'none',
                          transition: 'transform 0.2s ease',
                          '&:hover': {
                            transform: 'scale(1.1)'
                          }
                        }}
                        title={color}
                      />
                    ))
                  ) : (
                    <Typography sx={{ color: '#8FD3B4', fontStyle: 'italic' }}>
                      No colors available in your wardrobe
                    </Typography>
                  )}
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
              // background: 'rgba(18, 42, 33, 0.9)',
              borderRadius: '12px',
              padding: '30px',
              border: '1px solid rgba(40, 90, 70, 0.3)',
              height: 'fit-content'
            }}>
              <Typography variant="h5" sx={{ fontSize: '18px', fontWeight: 500, marginBottom: '20px' }}>
                Suggested Items
              </Typography>

              {!suggestions && !loading ? (
                <Typography sx={{ 
                  color: 'rgba(255, 255, 255, 0.5)', 
                  textAlign: 'center', 
                  fontSize: '14px',
                  fontStyle: 'italic'
                }}>
                  No suggestions generated yet. Select your preferences and click "Generate Outfit Suggestion"
                </Typography>
              ) : suggestions && !loading ? (
                <Box>
                  {Object.entries(suggestions).map(([category, items]) => (
                    <Box key={category} sx={{ marginBottom: '20px' }}>
                      <Typography variant="h6" sx={{ 
                        fontSize: '16px', 
                        fontWeight: 600, 
                        marginBottom: '10px',
                        color: '#8FD3B4',
                        textTransform: 'capitalize'
                      }}>
                        {category}
                      </Typography>
                      {items.length === 0 ? (
                        <Typography sx={{ 
                          color: 'rgba(255, 255, 255, 0.5)', 
                          fontSize: '14px',
                          fontStyle: 'italic',
                          marginLeft: '10px'
                        }}>
                          No {category} found matching your criteria
                        </Typography>
                      ) : (
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                          {items.map((item) => (
                            <Card key={item._id} sx={{ 
                              background: 'rgba(30, 65, 50, 0.7)',
                              borderRadius: '8px',
                              border: '1px solid rgba(60, 120, 100, 0.4)',
                              minWidth: '120px',
                              maxWidth: '150px'
                            }}>
                              <CardContent sx={{ padding: '10px !important' }}>
                                <img
                                  src={getImageSrc(item)}
                                  alt={item.name}
                                  style={{
                                    width: '60px',
                                    height: '60px',
                                    borderRadius: '5px',
                                    margin: '0 auto 8px',
                                    objectFit: 'cover',
                                    display: 'block'
                                  }}
                                />
                                <Typography sx={{ fontSize: '12px', color: '#fff', textAlign: 'center', marginBottom: '4px' }}>
                                  {item.name}
                                </Typography>
                                <Typography sx={{ fontSize: '10px', color: '#8FD3B4', textAlign: 'center' }}>
                                  {item.color} • {Array.isArray(item.style) ? item.style.join(', ') : (item.style || 'Any style')}
                                </Typography>
                              </CardContent>
                            </Card>
                          ))}
                        </Box>
                      )}
                    </Box>
                  ))}
                </Box>
              ) : null}
            </Paper>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

export default OutfitSuggestionComponent;
