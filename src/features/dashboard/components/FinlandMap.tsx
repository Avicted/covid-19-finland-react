import React, { useEffect, useRef, useState } from 'react'
import { Card, CardContent, makeStyles, Theme, Typography } from '@material-ui/core'
import { Map, TileLayer, GeoJSON, LayerGroup } from 'react-leaflet'
import * as L from "leaflet";
import finlandGeoJson from './../../../resources/geojson.json'
import hcdCentroidGeoJson from './../../../resources/hcdcentroidgeo.json'
import 'leaflet/dist/leaflet.css'
import { HcdTestData } from '../../../entities/HcdTestData'
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

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
    const [healthDistrictData, setHealthDistrictData] = useState<{ healthDistrictName: string, confirmed: number }[] | undefined>(undefined)
    const [tooltipsAdded, setTooltipsAdded] = useState<boolean>(false);
    const zoomThreshold: number = 5;
    const [startingCoords] = useState<Coords>({
        lat: 64.271179,
        lng: 26.939849,
        zoom: 5,
    });
    const position = (): [number, number] => {
        return [startingCoords.lat, startingCoords.lng];
    }

    // @Note: colors chosen as colorblind safe
    const getColor = (value: number): string => {
        return value > 1000 ? '#08589e' :
               value > 500  ? '#2b8cbe' :
               value > 200  ? '#4eb3d3' :
               value > 100  ? '#7bccc4' :
               value > 50   ? '#a8ddb5' :
               value > 20   ? '#ccebc5' :
               value > 10   ? '#f0f9e8' :
               value <= 10  ? '#f0f9e8' :
                              '#f0f9e8';
    }

    const healthDistrictMapStyle = (feature: any): any => {
        if (!healthDistrictData) {
            return;
        }

        const healthCareDistrict: string = feature.properties.healthCareDistrict;
        const confirmed: number | undefined = healthDistrictData.find(district => district.healthDistrictName === healthCareDistrict)?.confirmed;

        if (!confirmed) {
            return;
        }

        return {
            fillColor: getColor(confirmed),
            weight: 2,
            opacity: 1,
            color: 'white',
            dashArray: '3',
            
            fillOpacity: 0.7
        };
    }

    const formatData = (hcdTestData: HcdTestData): void => {
        const result: { healthDistrictName: string, confirmed: number }[] = [];
        Object.keys(hcdTestData).forEach((key) => {
            const healthDistrictName: string = key;
            const confirmed: number = hcdTestData[key].infected;
            result.push({
                healthDistrictName,
                confirmed,
            });
        });

        setHealthDistrictData(result);
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

        formatData(hcdTestData)
    }, [hcdTestData]);
    

    const createConfirmedMapLabels = (feature: any, layer: L.Layer): void => {
        if (feature.properties && feature.properties.healthCareDistrict) {
            layer.bindPopup(feature.properties.healthCareDistrict);
            
            if (!healthDistrictData || tooltipsAdded) {
                return;
            }

            const healthCareDistrict: string = feature.properties.healthCareDistrict;
            const confirmed: number | undefined = healthDistrictData.find(district => district.healthDistrictName === healthCareDistrict)?.confirmed;

            layer.bindTooltip(`${confirmed === undefined ? 0 : confirmed}`, { 
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

    // @TODO: needs work, the center labels are triggering the mouseover
    /* const onEachFeatureHealthDistrict = (feature: any, layer: L.Layer): void => {
        layer.on('mouseover', () => {
            console.log(`mouseover on layer: ${layer}`)
            if (feature.properties && !feature.properties.centerPoint) {
                layer.bindPopup(feature.properties.healthCareDistrict);
    
                if (!healthDistrictData || zoom <= zoomThreshold) {
                    return;
                }
    
                const healthCareDistrict: string = feature.properties.healthCareDistrict;
                const confirmed: number | undefined = healthDistrictData.find(district => district.healthDistrictName === healthCareDistrict)?.confirmed;
                layer.setPopupContent(`${feature.properties.healthCareDistrict}: ${confirmed === undefined ? 0 : confirmed}`)
            }
        })
    } */

    return (
        <Card className={classes.card}>
            <CardContent className={classes.cardcontent}>
                <Typography className={classes.title} gutterBottom>
                    Total infections by health care district map
                </Typography>
                {healthDistrictData !== undefined && (
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
                        <LayerGroup>
                            <GeoJSON
                                key='health-districts'
                                data={finlandGeoJson as any}
                                style={healthDistrictMapStyle}
                                // onEachFeature={onEachFeatureHealthDistrict}
                            />
                        </LayerGroup>
                        <LayerGroup>
                            <GeoJSON
                                key='center-of-health-districts'
                                data={hcdCentroidGeoJson as any}
                                // style={this.geoJSONStyle}
                                onEachFeature={createConfirmedMapLabels}
                            />
                        </LayerGroup>
                    </Map>
                )}
            </CardContent>
        </Card>
    )
}
