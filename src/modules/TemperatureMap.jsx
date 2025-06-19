import { useEffect, useState } from 'react'
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import './TemperatureMap.css';
import { API_URL } from '../utils/utils';
import L from "leaflet";
import { nanoid } from 'nanoid';

import { closestIndexTo } from "date-fns";

const DEFAULT_LAT = 40.4165;
const DEFAULT_LON = -3.70256;


const greenIcon = new L.Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});

const redIcon = L.icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.9.3/dist/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
});

const TemperatureMap = () => {

    const [data, setData] = useState([]);
    const [cityName, setCityName] = useState("");
    const [temperature, setTemperature] = useState(0);


    const [icon, setIcon] = useState(greenIcon);


    const [loading, setLoading] = useState(true);

    useEffect(() => {

        async function fetchData() {
            setLoading(true);
            const response = await fetch(API_URL);
            const responseData = await response.json();
            setData(responseData);
            setLoading(false);


        }

        fetchData();

    }, [])

    function onClickMarker(i, d) {

        setCityName("Ciudad " + i)
        setTemperature(getLastTemp(d))

     
    }

      function getLastTemp(d) {
        const tempIndex = closestIndexTo(new Date(), d.minutely_15.time);
        return  d.minutely_15.temperature_2m[tempIndex - 1];
     
    }
    function getIcon(d) {
        return  getLastTemp(d) > 25 ? redIcon : greenIcon;
    }

  

    return (
        <> {loading ? null : <MapContainer center={[DEFAULT_LAT, DEFAULT_LON]} zoom={13} className='map'  >
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {data.map((d, index) => (
                <Marker key={nanoid()} position={[d.latitude, d.longitude]}
                    icon={getIcon(d)}
                    eventHandlers={{
                        click: () => {
                            onClickMarker(index + 1, d)
                        },
                    }}
                >
                    <Popup>
                        {cityName}
                        Temperatura: {temperature}
                    </Popup>
                </Marker>
            ))}

        </MapContainer>} </>

    )
}

export default TemperatureMap