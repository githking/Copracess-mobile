export interface Geolocation {
    id: string;
    latitude: number;
    longitude: number;
}

export interface Price {
    id: string;
    price: number;
    market_price: number;
    date: string;
    organizationId: string;
}

export interface Organization {
    id: string;
    name: string;
    address: string;
    accessCode: string;
    createdAt: string;
    updatedAt: string; // Add this
    permit: string | null;
    isVerified: boolean;
    geolocationId: string | null; // Add this
    creatorId: string; // Add this
    geolocation: Geolocation;
    price: Price[];
    distance?: number;
}

export interface LocationData {
    coords: {
        latitude: number;
        longitude: number;
    };
}

export const PHILIPPINES_BOUNDS = {
    latitudeDelta: 16.5,
    longitudeDelta: 14,
    latitude: 12.8797,
    longitude: 121.774,
};
