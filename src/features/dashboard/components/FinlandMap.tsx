import React, { useEffect, useRef, useState } from 'react'
import { Card, CardContent, makeStyles, Theme, Typography } from '@material-ui/core'
import { Map, TileLayer, GeoJSON, LayerGroup } from 'react-leaflet'
import * as L from "leaflet";
import hcdCentroidGeoJson from './../../../resources/hcdcentroidgeo.json'
import 'leaflet/dist/leaflet.css'
import { HcdTestData } from '../../../entities/HcdTestData'
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';
import { MapInfo } from './MapInfo';

const useStyles = makeStyles((theme: Theme) => ({
    card: {
        minHeight: 800,
        display: 'flex',
        flexDirection: 'row',
    },
    title: {
        fontSize: 14,
        marginBottom: 0,
        paddingBottom: 10,
        display: 'flex',
    },
    cardcontent: {
        width: '100%',
    },
    mapContainer: {
        minHeight: 'calc(100% - 25px)',
    },
    leafletTooltip: {
        fontSize: '1.2rem',
        border: 'none',
        fontFamily: 'monospace',
        fontWeight: 500,
        boxShadow: 'none',
        color: 'black',
        backgroundColor: 'transparent',
    },
    markerIcon: {
        display: 'none',
    }
}))


type Coords = {
    lat: number,
    lng: number,
    zoom?: number,
};

interface FinlandMapProps {
    hcdTestData: HcdTestData | undefined
}

export const FinlandMap: React.FunctionComponent<FinlandMapProps> = ({
    hcdTestData,
}) => {
    const classes = useStyles(useStyles);
    const mapRef: any = useRef();
    const centerOfDistrictsRef: any = useRef();
    const [tooltipsAdded, setTooltipsAdded] = useState<boolean>(false);
    const zoomThreshold: number = 4;
    const [startingCoords] = useState<Coords>({
        lat: 64.271179,
        lng: 26.939849,
        zoom: 5,
    });
    const position = (): [number, number] => {
        return [startingCoords.lat, startingCoords.lng];
    }

    useEffect(() => {
        if (!hcdTestData) {
            return;
        }

        let DefaultIcon = L.icon({
            iconUrl: icon,
            shadowUrl: iconShadow,
            className: classes.markerIcon,  
        });

        L.Marker.prototype.options.icon = DefaultIcon;
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [hcdTestData]);
    

    const createConfirmedMapLabels = (feature: any, layer: L.Layer): void => {
        if (feature.properties && feature.properties.healthCareDistrict) {
            layer.bindPopup(feature.properties.healthCareDistrict);
            
            if (!hcdTestData || tooltipsAdded) {
                return;
            }

            const healthCareDistrict: string = feature.properties.healthCareDistrict;
            let infected: number | undefined = undefined;

            for (const district in hcdTestData) {
                if (district === healthCareDistrict) {
                    infected = hcdTestData[district].infected;
                    break;
                }
            }

            layer.bindTooltip(`${infected === undefined ? 0 : infected}`, { 
                permanent: true, 
                interactive: false, 
                offset: [0, 0],
                direction: 'center',
                className: classes.leafletTooltip,
            })

            setTooltipsAdded(true);
        }
    }

    const handleZoomChange = (event: L.LeafletEvent): void => {
        const map = mapRef.current;
        const leafletZoom: number = map.leafletElement.getZoom();
        
        if (map && leafletZoom > zoomThreshold) {
            map.leafletElement.eachLayer((layer: L.Layer) => {
                if (layer instanceof L.Marker) {
                    layer.openTooltip();
                }
            });
        } else if (map && leafletZoom <= zoomThreshold) {
            map.leafletElement.eachLayer((layer: L.Layer) => {
                if (layer instanceof L.Marker) {
                    layer.closeTooltip();
                }
            });
        }
    }

    return (
        <Card className={classes.card}>
            <CardContent className={classes.cardcontent}>
                <Typography className={classes.title} gutterBottom>
                    Total infections by health care district map
                </Typography>
                {hcdTestData !== undefined && (
                    <Map
                        ref={mapRef}
                        center={position()} 
                        zoom={startingCoords.zoom} 
                        className={classes.mapContainer}
                        onzoomend={(event: L.LeafletEvent) => {handleZoomChange(event)}}
                    >
                        <TileLayer
                            attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        />
                        <LayerGroup ref={centerOfDistrictsRef}>
                            <GeoJSON
                                key='center-of-health-districts'
                                data={hcdCentroidGeoJson as any}
                                onEachFeature={createConfirmedMapLabels}
                            />
                        </LayerGroup>
                        <MapInfo hcdTestData={hcdTestData} />
                    </Map>
                )}
            </CardContent>
        </Card>
    )
}
