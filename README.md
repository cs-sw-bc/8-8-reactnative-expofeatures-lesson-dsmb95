# Mobile Development — Lesson 8
## Building a Restaurant Finder & Camera App

---

## What You're Building

A two-screen mobile app with a bottom tab navigator:

- **Restaurants tab** — uses your GPS location to find nearby restaurants via the Overpass API (OpenStreetMap)
- **Camera tab** — opens your device camera and displays the photo you take

---

## Setup

```bash
npx create-expo-app@latest RestaurantFinder
cd RestaurantFinder
npx expo install expo-location
npx expo install expo-image-picker
npx expo install @react-navigation/native @react-navigation/bottom-tabs react-native-screens react-native-safe-area-context
```

File structure:

```
RestaurantFinder/
├── App.js
└── components/
    ├── Location.js
    └── PhotoLog.js
```

---

## Part 1 — Restaurant Finder (`Location.js`)

### How the Overpass API works

This app uses **Overpass API** to search OpenStreetMap data. It's completely free — no account or API key needed.

You send it a query that describes what you're looking for and where:

```
[out:json];node[amenity=restaurant](around:1000,LAT,LON);out body;
```

| Part | What it does |
|---|---|
| `[out:json]` | Return the response as JSON |
| `node` | Look for point locations on the map |
| `[amenity=restaurant]` | Filter to restaurants only |
| `(around:1000,LAT,LON)` | Within 1000 metres of these coordinates |
| `out body` | Include all tags (name, address, hours, etc.) in the response |

The query goes in the URL as a parameter:

```js
fetch(`https://overpass-api.de/api/interpreter?data=${encodeURIComponent(query)}`)
```

`encodeURIComponent()` converts the query into a URL-safe format (brackets and spaces would break the URL otherwise).

**Useful links:**
- `around` filter: http://osmlab.github.io/learnoverpass/en/docs/filters/around/
- Tag filter: http://osmlab.github.io/learnoverpass/en/docs/filters/tag/
- Test queries visually: https://overpass-turbo.eu

---

### Your TODOs — `Location.js`

Open `components/Location.js` and complete the following:

**TODO 1** — Request foreground location permission using `expo-location`.
If permission is denied, call `setError()` with a message and return early.
Docs: https://docs.expo.dev/versions/latest/sdk/location/

**TODO 2** — Get the device's current GPS position.
Destructure `latitude` and `longitude` from `position.coords`.
Call `setLocation({ latitude, longitude })` to display the coordinates on screen.

**TODO 3** — Build the Overpass query using `buildQuery(latitude, longitude)`.
Fetch from the Overpass API and parse the response as JSON.
Use `encodeURIComponent()` to safely include the query in the URL.

**TODO 4** — Filter `data.elements` to only include results that have a `name` tag.
Use `.filter()` and optional chaining `?.` to avoid crashes on incomplete data.
Pass the filtered array to `setRestaurants()`.

**TODO 5** — Display the restaurant name using `tags.name`.

**TODO 6** — Conditionally display the cuisine type using `tags.cuisine`.
Only render this line if `tags.cuisine` exists.

**TODO 7** — Display the formatted address using the `formatAddress()` helper.

**TODO 8** — Conditionally display opening hours using `tags.opening_hours`.

**TODO 9** — Conditionally display the phone number using `tags.phone`.

---

## Part 2 — Camera (`PhotoLog.js`)

### How `expo-image-picker` works

`expo-image-picker` lets you open the device's system camera or photo library from your app. When the user takes a photo, the result comes back as an object with a `uri` you can pass directly to an `<Image>` component.

Docs: https://docs.expo.dev/versions/latest/sdk/imagepicker/

---

### Your TODOs — `PhotoLog.js`

Open `components/PhotoLog.js` and complete the following:

**TODO 1** — Import `ImagePicker` from `expo-image-picker`.

**TODO 2** — Set up the camera permission hook using `ImagePicker.useCameraPermissions()`.

**TODO 3** — Check if permission is granted before opening the camera.
If not, call `requestPermission()`. If still not granted, return early.

**TODO 4** — Open the system camera using `ImagePicker.launchCameraAsync({ quality: 0.8 })`.
If the user did not cancel (`!result.canceled`), call `setPhoto(result.assets[0])`.

**TODO 5** — Display the photo using `<Image source={{ uri: photo.uri }} style={styles.image} />`.

---

## App Store Guidelines

Before you publish any app, both Apple and Google require you to follow their guidelines. Reading these before you build saves you from rejection after.

**Where to find them:**
- Apple: https://developer.apple.com/app-store/review/guidelines/
- Google Play: https://play.google.com/about/developer-content-policy/

---

### Privacy & Permissions

- Only request permissions your app actually uses
- Location permission is especially scrutinized — your permission dialog must clearly explain why you need it
- If your app collects any user data, a privacy policy is required

### Content Policies

- Your app must do what it says — no hidden or deceptive functionality
- Age ratings affect what content is allowed — apps targeting children have stricter rules

### Technical Requirements

- **iOS:** must support the latest iOS version within roughly one year of its release
- **Android:** target SDK requirements are updated every year
- Both platforms require 64-bit support

### The Review Process

| | Apple | Google Play |
|---|---|---|
| Review type | Human review | Largely automated |
| Typical wait | 1–3 days | Hours to 1 day |
| Rejection | Can reject for vague reasons | Can be revoked after publishing |

Rejection is not the end — you can fix the issue and resubmit. The key is reading the guidelines before you build, not after.

---

## Going Further

Once you've completed both screens, try adding one of these using its Expo docs page:

| Package | What it does | Docs |
|---|---|---|
| `expo-sharing` | Share the photo to WhatsApp, Messages, etc. | https://docs.expo.dev/versions/latest/sdk/sharing/ |
| `expo-speech` | Read out a restaurant name | https://docs.expo.dev/versions/latest/sdk/speech/ |
| `expo-haptics` | Add vibration feedback to the shutter button | https://docs.expo.dev/versions/latest/sdk/haptics/ |
| `expo-sensors` | Shake to refresh the restaurant list | https://docs.expo.dev/versions/latest/sdk/accelerometer/ |