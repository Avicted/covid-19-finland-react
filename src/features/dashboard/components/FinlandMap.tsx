import React, { useEffect, useRef, useState } from 'react'
import { Card, CardContent, makeStyles, Theme, Typography } from '@material-ui/core'
import hcdCentroidGeoJson from './../../../resources/hcdcentroidgeo.json'
import 'mapbox-gl/dist/mapbox-gl.css';
import { HcdTestData } from '../../../entities/HcdTestData'
import finlandGeoJson from './../../../resources/geojson.json'
import { useDispatch, useSelector } from 'react-redux';
import { AppState } from '../../../framework/store/rootReducer';
import { getHcdTestData } from '../reducers/dashboardReducer';
import mapboxgl, { LngLatBoundsLike } from 'mapbox-gl';
import { getPreviouslySelectedHealthcareDistrict, getSelectedHealthcareDistrict } from '../reducers/mapReducer';
import { mapActions } from '../actions/mapActions';
import { SelectedHealcareDistrict } from '../../../entities/SelectedHealthcareDistrict';

mapboxgl.accessToken = process.env.REACT_APP_MAPBOX_TOKEN as string;

const useStyles = makeStyles((theme: Theme) => ({
    card: {
        minHeight: 800,
        display: 'flex',
        flexDirection: 'row',
        [theme.breakpoints.down('sm')]: {
            minHeight: 'calc(100vh - 50px)',
        }
    },
    title: {
        fontSize: 14,
        marginBottom: 0,
        paddingBottom: 10,
        display: 'flex',
    },
    cardcontent: {
        position: 'relative',
        width: '100%',
    },
    mapContainer: {
        minHeight: 'calc(100% - 25px)',
    },
    infoTitle: {
        color: theme.palette.text.primary,
        margin: 0,
        marginBottom: 10,
        fontSize: '0.8rem',
    },
    info: {
        width: 300,
        float: 'right',
        position: 'absolute',
        zIndex: 5,
        right: 40,
        top: 70,
        padding: '1rem',
        background: theme.palette.background.paper,
        color: theme.palette.text.primary,
        fontFamily: 'Roboto',
        boxShadow: '0 0 20px 0px rgb(87 97 178)',
        borderRadius: '5px',
    },
    dataParagraph: {
        margin: 0,
        padding: 0,
        color: theme.palette.text.secondary,
        '& b': {
            color: theme.palette.text.primary,
        },
    },
}))

type Coords = {
    lat: number,
    lng: number,
    zoom?: number,
};

interface FinlandMapProps { }

export const FinlandMap: React.FunctionComponent<FinlandMapProps> = () => {
    const classes = useStyles(useStyles);
    const mapContainer = useRef<HTMLDivElement | null>(null);
    const [map, setMap] = useState<mapboxgl.Map | undefined>(undefined);
    const hcdTestData: HcdTestData | undefined = useSelector((state: AppState) => getHcdTestData(state));
    const [startingCoords] = useState<Coords>({
        lat: 64.792848,
        lng: 25.035203,
        zoom: 4.4,
    });
    const selectedHealthcareDistrict: SelectedHealcareDistrict | undefined = useSelector((state: AppState) => getSelectedHealthcareDistrict(state));
    const previouslySelectedHealthcareDistrict: SelectedHealcareDistrict | undefined = useSelector((state: AppState) => getPreviouslySelectedHealthcareDistrict(state));
    const dispatch = useDispatch();

    const bounds: LngLatBoundsLike = [
        {
            lng: -6.950207,
            lat: 55.875311,
        },
        {
            lng: 57.549195,
            lat: 72.244356,
        }
    ];

    useEffect(() => {
        const initializeMap = (): void => {
            const map = new mapboxgl.Map({
                container: mapContainer.current as any,
                style: process.env.REACT_APP_MAPBOX_STYLE_URL,
                center: [startingCoords.lng, startingCoords.lat],
                zoom: startingCoords.zoom,
                pitch: 40,
                maxZoom: 6,
                dragRotate: false,
                maxBounds: bounds,
            });

            map.on('load', (event: mapboxgl.MapboxEvent) => {
                map.addSource('healthcare-districts', {
                    type: 'geojson',
                    data: finlandGeoJson as any,
                });

                map.addSource('center-of-healthcare-districts', {
                    type: 'geojson',
                    data: hcdCentroidGeoJson as any,
                });

                // Create a layer for each healthcare district and style it accoring to the confirmed infections count
                finlandGeoJson.features.forEach((feature: any) => {
                    map.addLayer(
                        {
                            id: `district_${feature.properties.healthCareDistrict}`,
                            type: 'fill',
                            paint: {
                                'fill-color': healthDistrictColor(feature.properties.healthCareDistrict),
                                'fill-opacity': 0.4,
                            },
                            source: 'healthcare-districts',
                            filter: ['==', ['get', 'healthCareDistrict'], feature.properties.healthCareDistrict],
                        },
                    );
                });

                // Create a layer for each center point of the healthcare districts and add a 
                // symbol text with the confirmed infections count
                hcdCentroidGeoJson.features.forEach((feature: any) => {
                    map.addLayer(
                        {
                            id: `center_of_district_${feature.properties.healthCareDistrict}`,
                            type: 'symbol',
                            layout: {
                                'symbol-placement': 'point',
                                'text-font': ['Roboto Regular'],
                                'text-field': getConfirmedInfectionsInHealthcareDistrict(feature).toString(),
                                'text-allow-overlap': true,
                                'text-size': ['interpolate', ['linear'], ['zoom'], 4, 16, 5, 24],
                            },
                            paint: {
                                'text-color': 'rgba(255, 255, 255, 1)',
                                'text-halo-color': 'rgba(10, 10, 10, 0.5)',
                                'text-halo-width': 1,
                                'text-opacity': {
                                    'stops': [[4, 0], [4.2, 1]]
                                },
                            },
                            source: 'center-of-healthcare-districts',
                            filter: ['==', ['get', 'healthCareDistrict'], feature.properties.healthCareDistrict],
                        }
                    )
                });

                // Change the mouse pointer on hover
                map.on('mousemove', (event: mapboxgl.MapMouseEvent) => {
                    const features: mapboxgl.MapboxGeoJSONFeature[] = map.queryRenderedFeatures(event.point);
                    const feature: mapboxgl.MapboxGeoJSONFeature | undefined = features.find(feature => feature.layer.source === 'healthcare-districts');

                    if (feature === undefined) {
                        map.getCanvas().style.cursor = '';
                        return;
                    }

                    if (feature?.properties === null) {
                        map.getCanvas().style.cursor = '';
                        return;
                    }

                    map.getCanvas().style.cursor = 'pointer';
                });

                // Detect when the user is hovering over a healthcare district
                map.on('click', (event: mapboxgl.MapMouseEvent) => {
                    const features = map.queryRenderedFeatures(event.point);
                    const feature: any = features.find(feature => feature.layer.source === 'healthcare-districts');
                    
                    if (!feature) {
                        return;
                    }

                    if (feature.properties) {
                        return;
                    }

                    if (!feature.properties.healthCareDistrict || !feature.layer.id) {
                        return;
                    }

                    dispatch(mapActions.SetSelectedHealthcareDistrict({
                        name: feature.properties.healthCareDistrict,
                        layerId: feature.layer.id,
                    }));
                });

                setMap(map);
            });
        }

        if (!map) initializeMap();

        // Clean up on unmount
        return () => map?.remove();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [map]);

    useEffect(() => {
        if (!map) {
            return;
        }

        if (!selectedHealthcareDistrict) {
            return;
        }

        if (!previouslySelectedHealthcareDistrict) {
            map.setPaintProperty(selectedHealthcareDistrict?.layerId, 'fill-opacity', 0.7);
            map.setPaintProperty(selectedHealthcareDistrict?.layerId, 'fill-color', healthDistrictColor(selectedHealthcareDistrict.name));
            return;
        }

        if ((selectedHealthcareDistrict?.layerId !== previouslySelectedHealthcareDistrict?.layerId)) {
            map.setPaintProperty(previouslySelectedHealthcareDistrict.layerId, 'fill-opacity', 0.4);
            map.setPaintProperty(previouslySelectedHealthcareDistrict.layerId, 'fill-color', healthDistrictColor(previouslySelectedHealthcareDistrict.name));
            map.setPaintProperty(selectedHealthcareDistrict?.layerId, 'fill-opacity', 0.7);
            map.setPaintProperty(selectedHealthcareDistrict?.layerId, 'fill-color', healthDistrictColor(selectedHealthcareDistrict.name));
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedHealthcareDistrict, previouslySelectedHealthcareDistrict])

    const getConfirmedInfectionsInHealthcareDistrict = (feature: any): number => {
        const healthcareDistrict: string = feature.properties.healthCareDistrict;
        let infected: number | undefined = undefined;

        for (const district in hcdTestData) {
            if (district === healthcareDistrict) {
                infected = hcdTestData[district].infected;
                break;
            }
        }

        return infected === undefined ? 0 : infected;
    }

    const getColor = (value: number): string => {
        return value > 10000 ? '#800026' :
            value > 5000 ? '#BD0026' :
            value > 2000 ? '#E31A1C' :
            value > 1000 ? '#FC4E2A' :
            value > 500  ? '#FD8D3C' :
            value > 200  ? '#FEB24C' :
            value > 100  ? '#FED976' :
            value === 0  ? '#4962a9' :
                           '#FFEDA0';
    }

    const healthDistrictColor = (healthcareDistrict: string): string => {
        let infected: number | undefined = undefined;

        for (const district in hcdTestData) {
            if (district === healthcareDistrict) {
                infected = hcdTestData[district].infected;
                break;
            }
        }

        if (!infected) {
            infected = 0;
        }

        return getColor(infected);
    }

    const infoPanel = (): JSX.Element => {
        if (!selectedHealthcareDistrict?.name) {
            return <p>Click on a healthcare district to view data</p>;
        }

        let infected: number | undefined = undefined;
        let population: number | undefined = undefined;
        let tested: number | undefined = undefined;
        let percentageTested: string | undefined = undefined;
        let percentageInfected: string | undefined = undefined;

        for (const district in hcdTestData) {
            if (district === selectedHealthcareDistrict?.name) {
                infected = hcdTestData[district].infected;
                population = hcdTestData[district].population;
                tested = hcdTestData[district].tested;
                break;
            }
        }

        if (tested && population) {
            percentageTested = ((tested / population) * 100).toFixed(2);
        }
        if (infected && population) {
            percentageInfected = ((infected / population) * 100).toFixed(2);
        }

        const content: JSX.Element = (
            <>
                <h4 className={classes.infoTitle}>Healthcare district information</h4>
                <p className={classes.dataParagraph}>District: <b>{selectedHealthcareDistrict?.name}</b></p>
                <p className={classes.dataParagraph}>Infections: <b>{infected === undefined ? 'Unknown' : infected}</b></p>
                <p className={classes.dataParagraph}>Population: <b>{population === undefined ? 'Unknown' : population}</b></p>
                <p className={classes.dataParagraph}>Tested: <b>{tested === undefined ? 'Unknown' : tested}</b></p>
                <p className={classes.dataParagraph}>Percentage tested: <b>{percentageTested === undefined ? 'Unknown' : percentageTested}%</b></p>
                <p className={classes.dataParagraph}>Percentage infected: <b>{percentageInfected === undefined ? 'Unknown' : percentageInfected}%</b></p>
            </>
        );

        return content;
    }

    return (
        <Card className={classes.card}>
            <CardContent className={classes.cardcontent}>
                <Typography className={classes.title} gutterBottom>
                    Total infections by health care district map
                </Typography>
                <div className={classes.info} id="features">
                    {infoPanel()}
                </div>
                <div ref={mapContainer} className={classes.mapContainer} />
            </CardContent>
        </Card>
    )
}
