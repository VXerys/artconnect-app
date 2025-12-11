# Services Folder (`src/services/`)

**Services** adalah layer untuk komunikasi dengan **external APIs** (Backend REST API).

---

## 🎯 Apa itu Service?

**Service** = Pure API communication layer (no state management, no UI logic)

**Purpose:**
- Encapsulate API calls
- Abstract implementation details
- Provide clean interface untuk composables/components
- Handle request/response transformation

**Bedanya dengan composable:**
- **Service:** Pure API calls (Promise-based, no Vue reactivity)
- **Composable:** State management + orchestrate services

---

## 📂 Folder Structure

```
services/
├── api/                        # Backend REST API clients
│   ├── artworks.js             # Artwork API endpoints
│   ├── contacts.js             # Contacts API endpoints
│   ├── opportunities.js        # Opportunities API endpoints
│   ├── analytics.js            # Analytics API endpoints
│   └── auth.js                 # Auth API
│
└── storage/                    # File handling services
    ├── imageUpload.js          # Image upload helper
    └── fileDownload.js         # File download helper
```

---

## ✅ Best Practices

### 1. **Return Data (not Response)**

```javascript
// ❌ Jangan begini (return full response)
export async function getArtworks() {
  const response = await axios.get('/artworks')
  return response // ❌ Response object
}

// ✅ Begini (return data only)
export async function getArtworks() {
  const response = await axios.get('/artworks')
  return response.data // ✅ Clean data
}
```

**Why?**
- Caller doesn't need response metadata (headers, status, etc)
- Cleaner API
- Easy to mock dalam tests

---

### 2. **Throw Errors (Let Caller Handle)**

```javascript
// ❌ Jangan begini (swallow errors)
export async function getArtwork(id) {
  try {
    const response = await axios.get(`/artworks/${id}`)
    return response.data
  } catch (error) {
    console.error(error) // ❌ Silent error
    return null // ❌ Loses error info
  }
}

// ✅ Begini (throw errors)
export async function getArtwork(id) {
  const response = await axios.get(`/artworks/${id}`)
  return response.data
  // Let axios throw error, caller will handle
}
```

**Why?**
- Caller can decide how to handle errors (toast, retry, fallback)
- Preserve error info
- Better error tracking

---

### 3. **Use Async/Await (not .then())**

```javascript
// ❌ Jangan begini (.then() chains)
export function getArtworks() {
  return axios.get('/artworks')
    .then(response => response.data)
    .catch(error => {
      throw error
    })
}

// ✅ Begini (async/await)
export async function getArtworks() {
  const response = await axios.get('/artworks')
  return response.data
}
```

**Why?**
- More readable
- Easier error handling
- Modern JavaScript standard

---

### 4. **Export Object (not Individual Functions)**

```javascript
// ❌ Jangan begini (individual exports)
export async function getAll() { /* ... */ }
export async function getById(id) { /* ... */ }
export async function create(data) { /* ... */ }

// ✅ Begini (export object)
const artworksService = {
  async getAll() { /* ... */ },
  async getById(id) { /* ... */ },
  async create(data) { /* ... */ },
  async update(id, data) { /* ... */ },
  async delete(id) { /* ... */ }
}

export default artworksService
```

**Why?**
- Clear namespace (`artworksService.getAll()`)
- Easy to mock entire service
- Consistent pattern

---

### 5. **Transform Data (if Needed)**

```javascript
// Backend returns snake_case, frontend uses camelCase
const artworksService = {
  async getAll() {
    const response = await axios.get('/artworks')
    
    // Transform snake_case → camelCase
    return response.data.map(artwork => ({
      id: artwork.id,
      title: artwork.title,
      price: artwork.price,
      imageUrl: artwork.image_url, // ✅ Transform
      createdAt: artwork.created_at // ✅ Transform
    }))
  }
}
```

---

## 📝 Service Examples

### Example 1: Auth Service (Backend)

```javascript
// services/api/auth.js
import axiosClient from "@/api/axiosClient";

const authService = {
  async login(creds) {
    const response = await axiosClient.post('/auth/login', creds);
    return response.data;
  },

  async register(creds) {
    const response = await axiosClient.post('/auth/register', creds);
    return response.data;
  },

  async logout() {
    return axiosClient.post('/auth/logout');
  },
  
  async getProfile() {
    const response = await axiosClient.get('/auth/profile');
    return response.data;
  }
}

export default authService
```

### Example 2: Backend API Service (Artworks)

```javascript
// services/api/artworks.js
import axios from '@/config/axios'

const BASE_URL = '/artworks'

const artworksService = {
  async getAll() {
    const response = await axios.get(BASE_URL)
    return response.data
  },

  async getById(id) {
    const response = await axios.get(`${BASE_URL}/${id}`)
    return response.data
  },
  
  // ... other methods
}

export default artworksService
```

---

## 📖 Reference

- **Axios Docs:** https://axios-http.com/docs/intro
- **Fetch API:** https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API

---

**Next:** Baca README di `router/`, `utils/`, `config/`
