import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Bars } from 'react-loader-spinner';
import './MainScreen.css';

function MainScreen() {
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState(null);

  // Lists of options
  const rooms = [
    'living room','bedroom','kitchen','bathroom','dining room',
    "children's room",'home office','hallway','guest room','wardrobe room',
    'laundry room','corridor','pantry','restroom','toilet','cabinet room','office',
    'study','mudroom','library','game room','home Theater','gym','patio','balcony',
    'terrace','winter Garden','garage','pool area','greenhouse','sauna','bar',
    'music room','spa room','art studio','meditation room','wine cellar','hall',
  ];

  const styles = [
    'modern style','Scandinavian style','minimalist style','loft style','classic style',
    'contemporary style','transitional style','industrial style','farmhouse style',
    'neoclassical style','bohemian style','mid-century modern style','high-tech style',
    'coastal style','provence style','eco style','art deco','eclecticism style',
    'Mediterranean style','American style','Japanese style','French style','English style',
    'Zen style','Victorian style','retro style','Moroccan style','Indian style',
    'Chinese style','Tuscan style','ethno style','Arab style',
  ];

  const colors = [
    'gray','white','beige','cream','taupe','sand','light blue','soothing green','charcoal',
    'terracotta','warm yellow','olive green','soft pink','blush pink','peach','teal','mint',
    'navy blue','emerald green','mustard yellow','coral','lavender','powder blue',
    'chocolate brown','lilac','forest green','black','deep plum',
  ];

  const lightings = [
    'natural light','soft ambient lighting','task lighting','pendant lights','floor lamps',
    'under-cabinet lighting','accent lighting','strip lighting','neon lights','fairy lights',
    'smart lighting','lanterns','cove lighting',
  ];

  const materials = [
    'wooden floors','ceramic tiles','smooth surfaces','glass accents','concrete','plush carpets',
    'woven textiles','brick','metal accents','marble countertops','stone tiles','laminate',
    'textured wallpaper','bamboo','leather','velvet upholstery','cork','terrazzo','linen',
    'faux fur','canvas','mirror surfaces',
  ];

  const others = [
    'modern design','cozy atmosphere','high quality','minimalist aesthetic','luxurious feel',
    'photo-realistic rendering','high-resolution details','best quality','functional layout',
    'well-lit','balanced lighting','timeless design','vibrant colors','eco-friendly materials',
    'sharp details','soft contrast','durable design','versatile spaces','bold accents','natural tones',
    'nature-inspired','custom-made','seamless textures','geometric patterns','symmetrical design',
    'award winning','floral motifs','neutral palette','vintage charm','cinematic look','soft focus',
    'dynamic perspective','close-up details','highlighting textures','wide-angle view','depth of field',
  ];

  const negativeProperties = [
    'low quality','worst quality','blurry','pixelated','grainy','jpeg artifacts','distorted',
    'warped surfaces','bad perspective','inconsistent scale','floating objects','misaligned objects',
    'unnatural lighting','unnatural colors','color bleeding','artificial glow','broken furniture','ugly',
    'cartoony proportions','semi-realistic','cartoon','sketch','drawing','anime','morbid','gross',
  ];


  // States
  const [selectedRooms, setSelectedRooms] = useState([]);
  const [expandedRooms, setExpandedRooms] = useState(false);

  const [selectedStyles, setSelectedStyles] = useState([]);
  const [expandedStyles, setExpandedStyles] = useState(false);

  const [selectedColors, setSelectedColors] = useState([]);
  const [expandedColors, setExpandedColors] = useState(false);

  const [selectedLightings, setSelectedLightings] = useState([]);
  const [expandedLightings, setExpandedLightings] = useState(false);

  const [selectedMaterials, setSelectedMaterials] = useState([]);
  const [expandedMaterials, setExpandedMaterials] = useState(false);

  const [selectedOthers, setSelectedOthers] = useState([]);
  const [expandedOthers, setExpandedOthers] = useState(false);

  const [selectedNegatives, setSelectedNegatives] = useState([]);
  const [expandedNegatives, setExpandedNegatives] = useState(false);

  // For images
  const [originalImage, setOriginalImage] = useState(null);
  const [resizedImage, setResizedImage] = useState(null);
  const [generatedImage, setGeneratedImage] = useState(null);
  const [loading, setLoading] = useState(false);

  // Prompts text
  const [positivePromptText, setPositivePromptText] = useState('');
  const [negativePromptText, setNegativePromptText] = useState('');

  // Keep the text synced with chip selections
  useEffect(() => {
    const newPositive = [
      ...selectedRooms,
      ...selectedStyles,
      ...selectedColors,
      ...selectedLightings,
      ...selectedMaterials,
      ...selectedOthers,
    ].join(', ');
    setPositivePromptText(newPositive);
  }, [
    selectedRooms,
    selectedStyles,
    selectedColors,
    selectedLightings,
    selectedMaterials,
    selectedOthers,
  ]);

  useEffect(() => {
    const newNegative = selectedNegatives.join(', ');
    setNegativePromptText(newNegative);
  }, [selectedNegatives]);

  // Toggle selection
  const toggleSelection = (item, selectedArray, setSelectedArray) => {
    if (selectedArray.includes(item)) {
      setSelectedArray(selectedArray.filter(i => i !== item));
    } else {
      setSelectedArray([...selectedArray, item]);
    }
  };

  // Resize image
  const resizeImage = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = function (event) {
        const img = new Image();
        img.onload = function () {
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');

          const maxSize = 512;
          let width = img.width;
          let height = img.height;

          if (width > height) {
            if (width > maxSize) {
              height = Math.round(height * (maxSize / width));
              width = maxSize;
            }
          } else {
            if (height > maxSize) {
              width = Math.round(width * (maxSize / height));
              height = maxSize;
            }
          }

          canvas.width = width;
          canvas.height = height;
          ctx.drawImage(img, 0, 0, width, height);
          canvas.toBlob(
            (blob) => {
              const resizedFile = new File([blob], file.name, {
                type: file.type,
                lastModified: Date.now(),
              });
              resolve(resizedFile);
            },
            file.type,
            1
          );
        };
        img.src = event.target.result;
      };
      reader.onerror = function (error) {
        reject(error);
      };
      reader.readAsDataURL(file);
    });
  };

  // Handle file input
  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const rFile = await resizeImage(file);
    setResizedImage(rFile);
    setOriginalImage(URL.createObjectURL(rFile));
  };

  const backendUrl = process.env.REACT_APP_BACKEND_URL;

  // Generate design
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!resizedImage) {
      alert('Please upload a sketch image first!');
      return;
    }

    setLoading(true);
    setErrorMessage(null);
    const formData = new FormData();
    formData.append('positivePrompt', positivePromptText);
    formData.append('negativePrompt', negativePromptText);
    formData.append('image', resizedImage);

    try {
      const response = await axios.post(
        `${backendUrl}/api/generate`,
        formData,
        { headers: { 'Content-Type': 'multipart/form-data' } }
      );
      const imageUrl = response.data.output_url;
      setGeneratedImage(imageUrl);
    } catch (error) {
      console.error('Error generating image: ', error);
      const errorMsg = error.response?.data?.detail || error.message || 'Unknown error';
      setErrorMessage(`An error occurred during image generation: ${errorMsg}`);
    } finally {
      setLoading(false);
    }
  };



  // Load Example
  const handleExample = async () => {
    setSelectedRooms(['living room']);
    setSelectedStyles(['Scandinavian style']);
    setSelectedColors(['white', 'navy blue']);
    setSelectedLightings(['natural light']);
    setSelectedMaterials(['wooden floors', 'mirror surfaces']);
    setSelectedOthers(['cozy atmosphere', 'high quality']);
    setSelectedNegatives(['low quality', 'blurry', 'sketch', 'cartoon', 'drawing']);

    const exampleUrl = '/example_sketch.png';
    fetch(exampleUrl)
      .then((res) => res.blob())
      .then((blob) => {
        const file = new File([blob], 'example_sketch.png', { type: 'image/png' });
        setOriginalImage(URL.createObjectURL(file));
        resizeImage(file).then((resizedFile) => {
          setResizedImage(resizedFile);
        });
      })
      .catch((err) => console.error('Error fetching example sketch:', err));
  };

  return (
    <div className="main-screen">
      {/* Header */}
      <header className="top-bar">
        <div className="logo" onClick={() => navigate('/')}>
          MyInterior-AI
        </div>
        <a
          className="github-link"
          href="https://github.com/Daniil-Horobets/MyInterior-AI"
          target="_blank"
          rel="noopener noreferrer"
        >
          GitHub
        </a>
      </header>

      <h2>Create Your Interior Design</h2>

      {/* Example Button */}
      <div style={{ marginTop: '1rem' }}>
        <button className="btn-secondary" onClick={handleExample}>
          Load Example
        </button>
      </div>

      {/* Main container */}
      <div className="content-container">
        {/* LEFT COLUMN */}
        <div className="left-column scrollable-column">
          <h3>Positive Prompts</h3>

          {/* Rooms */}
          <div className="prompt-category">
            <h4>Room ({selectedRooms.length})</h4>
            <div className={`chip-container ${expandedRooms ? 'expanded' : 'collapsed'}`}>
              {rooms.map((item) => (
                <span
                  key={item}
                  className={`chip ${selectedRooms.includes(item) ? 'selected' : ''}`}
                  onClick={() => toggleSelection(item, selectedRooms, setSelectedRooms)}
                >
                  {item}
                </span>
              ))}
            </div>
            {rooms.length > 6 && (
              <div className="showMore">
                <button type="button" onClick={() => setExpandedRooms(!expandedRooms)}>
                  {expandedRooms ? 'Show less' : 'Show more'}
                </button>
              </div>
            )}
          </div>

          {/* Styles */}
          <div className="prompt-category">
            <h4>Style ({selectedStyles.length})</h4>
            <div className={`chip-container ${expandedStyles ? 'expanded' : 'collapsed'}`}>
              {styles.map((item) => (
                <span
                  key={item}
                  className={`chip ${selectedStyles.includes(item) ? 'selected' : ''}`}
                  onClick={() => toggleSelection(item, selectedStyles, setSelectedStyles)}
                >
                  {item}
                </span>
              ))}
            </div>
            {styles.length > 6 && (
              <div className="showMore">
                <button type="button" onClick={() => setExpandedStyles(!expandedStyles)}>
                  {expandedStyles ? 'Show less' : 'Show more'}
                </button>
              </div>
            )}
          </div>

          {/* Colors */}
          <div className="prompt-category">
            <h4>Color Scheme ({selectedColors.length})</h4>
            <div className={`chip-container ${expandedColors ? 'expanded' : 'collapsed'}`}>
              {colors.map((item) => (
                <span
                  key={item}
                  className={`chip ${selectedColors.includes(item) ? 'selected' : ''}`}
                  onClick={() => toggleSelection(item, selectedColors, setSelectedColors)}
                >
                  {item}
                </span>
              ))}
            </div>
            {colors.length > 6 && (
              <div className="showMore">
                <button type="button" onClick={() => setExpandedColors(!expandedColors)}>
                  {expandedColors ? 'Show less' : 'Show more'}
                </button>
              </div>
            )}
          </div>

          {/* Lightings */}
          <div className="prompt-category">
            <h4>Lighting Option ({selectedLightings.length})</h4>
            <div className={`chip-container ${expandedLightings ? 'expanded' : 'collapsed'}`}>
              {lightings.map((item) => (
                <span
                  key={item}
                  className={`chip ${selectedLightings.includes(item) ? 'selected' : ''}`}
                  onClick={() => toggleSelection(item, selectedLightings, setSelectedLightings)}
                >
                  {item}
                </span>
              ))}
            </div>
            {lightings.length > 6 && (
              <div className="showMore">
                <button type="button" onClick={() => setExpandedLightings(!expandedLightings)}>
                  {expandedLightings ? 'Show less' : 'Show more'}
                </button>
              </div>
            )}
          </div>

          {/* Materials */}
          <div className="prompt-category">
            <h4>Material ({selectedMaterials.length})</h4>
            <div className={`chip-container ${expandedMaterials ? 'expanded' : 'collapsed'}`}>
              {materials.map((item) => (
                <span
                  key={item}
                  className={`chip ${selectedMaterials.includes(item) ? 'selected' : ''}`}
                  onClick={() => toggleSelection(item, selectedMaterials, setSelectedMaterials)}
                >
                  {item}
                </span>
              ))}
            </div>
            {materials.length > 6 && (
              <div className="showMore">
                <button type="button" onClick={() => setExpandedMaterials(!expandedMaterials)}>
                  {expandedMaterials ? 'Show less' : 'Show more'}
                </button>
              </div>
            )}
          </div>

          {/* Others */}
          <div className="prompt-category">
            <h4>Other Option ({selectedOthers.length})</h4>
            <div className={`chip-container ${expandedOthers ? 'expanded' : 'collapsed'}`}>
              {others.map((item) => (
                <span
                  key={item}
                  className={`chip ${selectedOthers.includes(item) ? 'selected' : ''}`}
                  onClick={() => toggleSelection(item, selectedOthers, setSelectedOthers)}
                >
                  {item}
                </span>
              ))}
            </div>
            {others.length > 6 && (
              <div className="showMore">
                <button type="button" onClick={() => setExpandedOthers(!expandedOthers)}>
                  {expandedOthers ? 'Show less' : 'Show more'}
                </button>
              </div>
            )}
          </div>

          <h3>Negative Prompts</h3>
          <div className="prompt-category">
            <h4>Unwanted Properties ({selectedNegatives.length})</h4>
            <div className={`chip-container ${expandedNegatives ? 'expanded' : 'collapsed'}`}>
              {negativeProperties.map((item) => (
                <span
                  key={item}
                  className={`chip ${selectedNegatives.includes(item) ? 'selected' : ''}`}
                  onClick={() => toggleSelection(item, selectedNegatives, setSelectedNegatives)}
                >
                  {item}
                </span>
              ))}
            </div>
            {negativeProperties.length > 6 && (
              <div className="showMore">
                <button type="button" onClick={() => setExpandedNegatives(!expandedNegatives)}>
                  {expandedNegatives ? 'Show less' : 'Show more'}
                </button>
              </div>
            )}
          </div>

          {/* Textareas for final prompts */}
          <div className="prompt-editor">
            <div className="prompt-field">
              <strong>Positive Prompt:</strong>
              <textarea
                value={positivePromptText}
                onChange={(e) => setPositivePromptText(e.target.value)}
                rows={3}
                style={{ width: '100%', marginTop: '0.3em' }}
              />
            </div>

            <div className="prompt-field" style={{ marginTop: '1em' }}>
              <strong>Negative Prompt:</strong>
              <textarea
                value={negativePromptText}
                onChange={(e) => setNegativePromptText(e.target.value)}
                rows={3}
                style={{ width: '100%', marginTop: '0.3em' }}
              />
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN */}
        <div className="right-column">
          <div className="upload-section">
            <label>Upload a Sketch (required)</label>
            <input type="file" accept="image/*" onChange={handleFileChange} />
          </div>

          <div className="button-container">
            <button className="btn-generate" onClick={handleSubmit} disabled={loading}>
              {loading ? 'Generating...' : 'Generate Design'}
            </button>
          </div>

          {/* Error message */}
          {errorMessage && (
            <div className="error-container">
              <p className="error-message">{errorMessage}</p>
            </div>
          )}

          {/* Progress bar section */}
          {loading && (
            <div className="progress-container">
              <Bars
                height="15"
                width="15"
                color="#6200ea"
                ariaLabel="loading-indicator"
              />
              <p>Generating your design... Please wait.</p>
            </div>
          )}

          <div className="image-section">
            {originalImage && (
              <div className="preview-container">
                <h4>Uploaded Image:</h4>
                <img src={originalImage} alt="Uploaded Sketch" className="preview-img" />
              </div>
            )}
            {generatedImage && (
              <div className="generated-container">
                <h4>Generated Interior Design:</h4>
                <img src={generatedImage} alt="Generated Design" className="generated-img" />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default MainScreen;