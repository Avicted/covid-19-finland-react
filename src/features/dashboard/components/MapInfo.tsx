import { useLeaflet } from "react-leaflet";
import L from "leaflet";
import { useEffect } from "react";
import finlandGeoJson from './../../../resources/geojson.json'
import { makeStyles } from "@material-ui/core";
import { HcdTestData } from "../../../entities/HcdTestData";
import React from "react";
import theme from "../../../theme/theme";

const useStyles = makeStyles({
    title: {
        color: 'black',
        margin: 0,
        marginBottom: 10,
        fontSize: '0.8rem',
    },
    info: {
        padding: '1rem',
        background: 'white',
        color: 'black',
        fontFamily: 'Roboto',
        boxShadow: '0 0 15px rgba(0,0,0,0.2)',
        borderRadius: '5px',
    },
    dataParagraph: {
        margin: 0,
        padding: 0,
    },
})

interface MapInfoProps {
    hcdTestData: HcdTestData | undefined
}

export const MapInfo: React.FunctionComponent<MapInfoProps> = ({
    hcdTestData,
}) => {
    const { map } = useLeaflet();
    const classes = useStyles();

    useEffect(() => {
        if (hcdTestData === undefined) {
            return;
        }

        // control that shows state info on hover
        let info: any = new L.Control();

        info.onAdd = (): HTMLElement => {
            info._div = L.DomUtil.create("div", "info");
            L.DomUtil.addClass(info._div, classes.info);
            info.update();
            return info._div;
        };

        info.update = (props: any) => {
            info._div.innerHTML = infoPanel(props);
        };

        info.addTo(map as any);

        const highlightFeature = (e: any) => {
            const layer = e.target;

            layer.setStyle({
                weight: 3,
                color: theme.palette.warning.main,
                dashArray: '',
                fillOpacity: 0.8
            });

            if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
                layer.bringToFront();
            }

            info.update(layer.feature.properties);
        };

        let geojson: any;

        const resetHighlight = (e: any) => {
            geojson.resetStyle(e.target);
            info.update();
        };

        const zoomToFeature = (e: any) => {
            map?.fitBounds(e.target.getBounds());
        };

        const onEachFeature = (feature: any, layer: any) => {
            layer.on({
                mouseover: highlightFeature,
                mouseout: resetHighlight,
                click: zoomToFeature
            });
        };

        geojson = L.geoJSON(finlandGeoJson as any, {
            style: healthDistrictMapStyle,
            onEachFeature: onEachFeature,
        }).addTo(map as any);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [hcdTestData]);

    const infoPanel = (props: any): any => {
        const healthCareDistrict: string = props?.healthCareDistrict;
        let infected: number | undefined = undefined;
        let population: number | undefined = undefined;
        let tested: number | undefined = undefined;
        let percentageTested: string | undefined = undefined;
        let percentageInfected: string | undefined = undefined;

        for (const district in hcdTestData) {
            if (district === healthCareDistrict) {
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
        if (!props) {
            return `<p>Hover over a healthcare district to view data</p>`
        }

        const content: string = `
            <h4 class=${classes.title}>Healthcare district information</h4>
            <p class=${classes.dataParagraph}>District: <b>${healthCareDistrict}</b></p>
            <p class=${classes.dataParagraph}>Infections: <b>${infected === undefined ? 'Unknown' : infected}</b></p>
            <p class=${classes.dataParagraph}>Population: <b>${population === undefined ? 'Unknown' : population}</b></p>
            <p class=${classes.dataParagraph}>Tested: <b>${tested === undefined ? 'Unknown' : tested}</b></p>
            <p class=${classes.dataParagraph}>Percentage tested: <b>${percentageTested === undefined ? 'Unknown' : percentageTested}%</b></p>
            <p class=${classes.dataParagraph}>Percentage infected: <b>${percentageInfected === undefined ? 'Unknown' : percentageInfected}%</b></p>
        `;

        return content;
    }

    const getColor = (value: number): string => {
        return value > 10000 ? '#800026' :
            value > 5000     ? '#BD0026' :
            value > 2000     ? '#E31A1C' :
            value > 1000     ? '#FC4E2A' :
            value > 500      ? '#FD8D3C' :
            value > 200      ? '#FEB24C' :
            value > 100      ? '#FED976' :
                               '#FFEDA0';
    }

    const healthDistrictMapStyle = (feature: any): any => {
        if (!hcdTestData) {
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

        if (!infected) {
            infected = 0;
        }

        return {
            fillColor: getColor(infected),
            weight: 2,
            opacity: 1,
            color: 'white',
            dashArray: '3',
            fillOpacity: 0.7
        };
    }

    return null;
};
