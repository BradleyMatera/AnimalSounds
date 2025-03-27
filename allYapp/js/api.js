const API_KEY = '7ubxfcDgot68FA5qRB04KIl2pfIYKbIwVlEyo2dlj9G7iWEehYtsUAqe';
const API_URL = 'https://api.pexels.com/v1/search';

const fetchAnimalImage = (animal) => {
    return fetch(`${API_URL}?query=${animal}&per_page=1`, {
        headers: {
            Authorization: API_KEY
        }
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
    })
    .then(data => {
        if (data.photos && data.photos.length > 0) {
            return data.photos[0].src.medium;
        } else {
            throw new Error('No image found');
        }
    })
    .catch(error => {
        console.error('Error fetching image:', error);
        return null;
    });
};

export { fetchAnimalImage };
