
import React, { useState } from 'react';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext.jsx';
import styled from 'styled-components';

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
`;

const Title = styled.h1`
  color: #333;
  margin-bottom: 2rem;
`;

const FiltersSection = styled.div`
  background: white;
  padding: 2rem;
  border-radius: 10px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
  margin-bottom: 2rem;
`;

const FilterRow = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  margin-bottom: 1rem;
`;

const Input = styled.input`
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 5px;
  font-size: 1rem;
`;

const Select = styled.select`
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 5px;
  font-size: 1rem;
`;

const Button = styled.button`
  background: #667eea;
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 5px;
  cursor: pointer;
  font-size: 1rem;
  margin-top: 1rem;
  
  &:hover {
    background: #5a6fd8;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 1rem;
`;

const PrimaryButton = styled(Button)`
  background: #667eea;
`;

const SecondaryButton = styled(Button)`
  background: #00b894;
  
  &:hover {
    background: #00a085;
  }
`;

const WeatherSection = styled.div`
  background: linear-gradient(135deg, #74b9ff 0%, #0984e3 100%);
  color: white;
  padding: 1.5rem;
  border-radius: 10px;
  margin-bottom: 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const WeatherInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const WeatherIcon = styled.div`
  font-size: 3rem;
`;

const WeatherDetails = styled.div`
  h3 {
    margin: 0 0 0.5rem 0;
  }
  p {
    margin: 0;
    opacity: 0.9;
  }
`;

const SuggestionsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
`;

const CategorySection = styled.div`
  background: white;
  border-radius: 10px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
  overflow: hidden;
`;

const CategoryHeader = styled.div`
  background: #667eea;
  color: white;
  padding: 1rem;
  font-weight: bold;
  text-transform: capitalize;
`;

const ItemsList = styled.div`
  padding: 1rem;
`;

const SuggestionItem = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 0.75rem;
  border-radius: 5px;
  margin-bottom: 0.5rem;
  transition: background-color 0.2s;
  
  &:hover {
    background-color: #f8f9fa;
  }
`;

const ItemImage = styled.img`
  width: 60px;
  height: 60px;
  object-fit: cover;
  border-radius: 5px;
`;

const ItemInfo = styled.div`
  flex: 1;
`;

const ItemName = styled.h4`
  margin: 0 0 0.25rem 0;
  color: #333;
`;

const ItemDetails = styled.p`
  margin: 0;
  color: #666;
  font-size: 0.9rem;
`;

// AI Outfit Styles
const AIOutfitsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 2rem;
`;

const OutfitCard = styled.div`
  background: white;
  border-radius: 15px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  transition: transform 0.3s, box-shadow 0.3s;
  
  &:hover {
    transform: translateY(-10px);
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
  }
`;

const OutfitHeader = styled.div`
  background: linear-gradient(135deg, #00b894 0%, #00a085 100%);
  color: white;
  padding: 1.5rem;
  text-align: center;
`;

const OutfitTitle = styled.h3`
  margin: 0 0 0.5rem 0;
  font-size: 1.3rem;
`;

const OutfitDescription = styled.p`
  margin: 0;
  opacity: 0.9;
  font-size: 0.9rem;
`;

const OutfitItems = styled.div`
  padding: 1.5rem;
`;

const OutfitItem = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  border-radius: 10px;
  margin-bottom: 1rem;
  background: #f8f9fa;
  border-left: 4px solid #00b894;
`;

const OutfitItemImage = styled.img`
  width: 80px;
  height: 80px;
  object-fit: cover;
  border-radius: 10px;
`;

const OutfitItemInfo = styled.div`
  flex: 1;
`;

const OutfitItemName = styled.h4`
  margin: 0 0 0.5rem 0;
  color: #333;
`;

const OutfitItemDetails = styled.p`
  margin: 0;
  color: #666;
  font-size: 0.9rem;
`;

const EmptyMessage = styled.div`
  text-align: center;
  padding: 2rem;
  color: #666;
`;

const LoadingMessage = styled.div`
  text-align: center;
  padding: 2rem;
  color: #667eea;
`;

const SuggestionTypeSelector = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 1rem;
`;

const TypeButton = styled.button`
  padding: 0.75rem 1.5rem;
  border: 2px solid ${props => props.active ? '#667eea' : '#ddd'};
  background: ${props => props.active ? '#667eea' : 'white'};
  color: ${props => props.active ? 'white' : '#333'};
  border-radius: 5px;
  cursor: pointer;
  font-size: 1rem;
  transition: all 0.2s;
  
  &:hover {
    border-color: #667eea;
    background: ${props => props.active ? '#5a6fd8' : '#f8f9fa'};
  }
`;

function SuggestionsComponent() {
  const { user } = useAuth();
  const [filters, setFilters] = useState({
    color: '',
    style: '',
    occasion: '',
    weather: ''
  });
  const [city, setCity] = useState('');
  const [weather, setWeather] = useState(null);
  const [suggestions, setSuggestions] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });
  const [availableOptions, setAvailableOptions] = useState({
    colors: [],
    styles: [],
    occasions: [],
    weathers: []
  });
  const [allItems, setAllItems] = useState([]);

  const getWeatherIcon = (condition) => {
    const icons = {
      'Clear': '☀️',
      'Clouds': '☁️',
      'Rain': '🌧️',
      'Snow': '❄️',
      'Thunderstorm': '⛈️',
      'Drizzle': '🌦️',
      'Mist': '🌫️',
      'Fog': '🌫️'
    };
    return icons[condition] || '🌤️';
  };

  const getWeatherSeason = (temperature) => {
    if (temperature < 10) return 'winter';
    if (temperature < 20) return 'spring';
    if (temperature < 30) return 'fall';
    return 'summer';
  };

  const fetchWeather = async () => {
    if (!city.trim()) {
      alert('Please enter a city name');
      return;
    }
    
    try {
      const response = await axios.get(`http://localhost:3000/api/clothes/weather/${city}`);
      setWeather(response.data.weather);
    } catch (error) {
      console.error('Error fetching weather:', error);
      alert(error.response?.data?.message || 'Error fetching weather data');
    }
  };

  const getRuleBasedSuggestions = async () => {
    if (!user) {
      showMessage('Please log in to get suggestions', 'error');
      return;
    }

    setLoading(true);
    setMessage({ text: '', type: '' });
    
    try {
      const preferences = {
        color: filters.color,
        style: filters.style
      };
      
      const weatherType = weather ? getWeatherSeason(weather.temperature) : filters.weather;
      
      const response = await axios.post('http://localhost:3000/api/clothes/suggestions', {
        preferences,
        weather: weatherType,
        occasion: filters.occasion
      }, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      if (response.data.suggestions) {
        setSuggestions(response.data.suggestions);
        showMessage('Suggestions loaded successfully!', 'success');
      } else {
        showMessage('No suggestions found matching your criteria', 'warning');
        setSuggestions(null);
      }
    } catch (error) {
      console.error('Error getting suggestions:', error);
      showMessage(
        error.response?.data?.message || 'Error getting suggestions',
        'error'
      );
    } finally {
      setLoading(false);
    }
  };

  const showMessage = (text, type = 'info') => {
    setMessage({ text, type });
  };

  // Filter options based on current selections
  const getFilteredOptions = () => {
    let filteredItems = allItems;

    // Filter by color if selected
    if (filters.color) {
      filteredItems = filteredItems.filter(item => item.color === filters.color);
    }

    // Filter by style if selected
    if (filters.style) {
      filteredItems = filteredItems.filter(item => {
        const itemStyles = Array.isArray(item.style) ? item.style : [item.style];
        return itemStyles.includes(filters.style);
      });
    }

    // Filter by occasion if selected
    if (filters.occasion) {
      filteredItems = filteredItems.filter(item => {
        const itemOccasions = Array.isArray(item.occasion) ? item.occasion : [item.occasion];
        return itemOccasions.includes(filters.occasion);
      });
    }

    // Filter by weather if selected
    if (filters.weather) {
      filteredItems = filteredItems.filter(item => {
        const itemWeathers = Array.isArray(item.seasonType) ? item.seasonType : [item.seasonType];
        return itemWeathers.includes(filters.weather);
      });
    }

    // Extract available options from filtered items
    const availableColors = [...new Set(filteredItems.map(item => item.color).filter(Boolean))];
    const availableStyles = [...new Set(filteredItems.flatMap(item => 
      Array.isArray(item.style) ? item.style : [item.style]
    ).filter(Boolean))];
    const availableOccasions = [...new Set(filteredItems.flatMap(item => 
      Array.isArray(item.occasion) ? item.occasion : [item.occasion]
    ).filter(Boolean))];
    const availableWeathers = [...new Set(filteredItems.flatMap(item => 
      Array.isArray(item.seasonType) ? item.seasonType : [item.seasonType]
    ).filter(Boolean))];

    return {
      colors: availableColors.sort(),
      styles: availableStyles.sort(),
      occasions: availableOccasions.sort(),
      weathers: availableWeathers.sort()
    };
  };

  const handleFilterChange = (field, value) => {
    setFilters(prev => {
      const newFilters = { ...prev, [field]: value };
      
      // Reset dependent fields when a parent field changes
      if (field === 'color') {
        newFilters.style = '';
        newFilters.occasion = '';
        newFilters.weather = '';
      } else if (field === 'style') {
        newFilters.occasion = '';
        newFilters.weather = '';
      } else if (field === 'occasion') {
        newFilters.weather = '';
      }
      
      return newFilters;
    });
  };

  const fetchAvailableOptions = async () => {
    if (!user) return;

    try {
      const response = await axios.get('http://localhost:3000/api/clothes/get-all-clothes', {
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

  // Fetch available options when component mounts
  React.useEffect(() => {
    if (user) {
      fetchAvailableOptions();
    }
  }, [user]);

  return (
    <Container>
      <Title>Clothing Suggestions</Title>
      
      <FiltersSection>
        <h3>Get Clothing Suggestions</h3>
        <p>Enter your preferences to get personalized clothing suggestions from your wardrobe.</p>

        <FilterRow>
          <Select
            value={filters.color}
            onChange={(e) => handleFilterChange('color', e.target.value)}
          >
            <option value="">Any Color</option>
            {getFilteredOptions().colors.map(color => (
              <option key={color} value={color}>{color}</option>
            ))}
          </Select>
          <Select
            value={filters.style}
            onChange={(e) => handleFilterChange('style', e.target.value)}
          >
            <option value="">Any Style</option>
            {getFilteredOptions().styles.map(style => (
              <option key={style} value={style}>{style}</option>
            ))}
          </Select>
          <Select
            value={filters.occasion}
            onChange={(e) => handleFilterChange('occasion', e.target.value)}
          >
            <option value="">Any Occasion</option>
            {getFilteredOptions().occasions.map(occasion => (
              <option key={occasion} value={occasion}>{occasion}</option>
            ))}
          </Select>
          <Select
            value={filters.weather}
            onChange={(e) => handleFilterChange('weather', e.target.value)}
          >
            <option value="">Any Season</option>
            {getFilteredOptions().weathers.map(weather => (
              <option key={weather} value={weather}>{weather}</option>
            ))}
          </Select>
        </FilterRow>
        
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <Input
            type="text"
            placeholder="Enter city for weather"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            style={{ flex: 1 }}
          />
          <Button onClick={fetchWeather}>Get Weather</Button>
        </div>

        <ButtonGroup>
          <PrimaryButton onClick={getRuleBasedSuggestions}>
            Get Suggestions
          </PrimaryButton>
        </ButtonGroup>

        {message.text && (
          <div style={{ 
            marginTop: '1rem', 
            padding: '1rem', 
            borderRadius: '5px',
            backgroundColor: message.type === 'error' ? '#ffebee' : 
                            message.type === 'success' ? '#e8f5e8' : 
                            message.type === 'warning' ? '#fff3e0' : '#e3f2fd',
            color: message.type === 'error' ? '#c62828' : 
                   message.type === 'success' ? '#2e7d32' : 
                   message.type === 'warning' ? '#f57c00' : '#1976d2',
            border: `1px solid ${message.type === 'error' ? '#ffcdd2' : 
                                message.type === 'success' ? '#c8e6c9' : 
                                message.type === 'warning' ? '#ffcc02' : '#bbdefb'}`
          }}>
            {message.text}
          </div>
        )}
      </FiltersSection>

      {weather && (
        <WeatherSection>
          <WeatherInfo>
            <WeatherIcon>{getWeatherIcon(weather.condition)}</WeatherIcon>
            <WeatherDetails>
              <h3>{city}</h3>
              <p>{weather.temperature}°C - {weather.description}</p>
            </WeatherDetails>
          </WeatherInfo>
        </WeatherSection>
      )}

      {loading && (
        <LoadingMessage>
          <h3>Finding the perfect suggestions for you...</h3>
        </LoadingMessage>
      )}

      {/* Rule-based suggestions */}
      {suggestions && !loading && (
        <SuggestionsGrid>
          {Object.entries(suggestions).map(([category, items]) => (
            <CategorySection key={category}>
              <CategoryHeader>{category}</CategoryHeader>
              <ItemsList>
                {items.length === 0 ? (
                  <EmptyMessage>No {category} found matching your criteria</EmptyMessage>
                ) : (
                  items.map((item) => (
                    <SuggestionItem key={item._id}>
                      <ItemImage src={item.imageBase64 || item.imageUrl} alt={item.name} />
                      <ItemInfo>
                        <ItemName>{item.name}</ItemName>
                        <ItemDetails>
                          {item.color} • {Array.isArray(item.style) ? item.style.join(', ') : (item.style || 'Any style')} • {Array.isArray(item.occasion) ? item.occasion.join(', ') : (item.occasion || 'Any occasion')}
                        </ItemDetails>
                      </ItemInfo>
                    </SuggestionItem>
                  ))
                )}
              </ItemsList>
            </CategorySection>
          ))}
        </SuggestionsGrid>
      )}

      {!suggestions && !loading && (
        <EmptyMessage>
          <h3>Ready to get suggestions?</h3>
          <p>
            Enter your preferences above and click "Get Suggestions" to see clothing items from your wardrobe 
            that match your criteria. You can filter by color, style, occasion, and weather.
          </p>
        </EmptyMessage>
      )}
    </Container>
  );
}

export default SuggestionsComponent;
