import { useEffect, useState } from "react";
import { API_URL } from "../utils/utils";
import { DataGrid, GridLogicOperator } from '@mui/x-data-grid';
import { format } from "date-fns";
import { nanoid } from 'nanoid';
import './Table.css';



const COLUMNS_DEFINITION = [
    { field: "id", filterable: false },
    {
        field: "city", width: 300,
        headerName: "Ciudad"

    },
    {
        field: "temperature", width: 300,
        headerName: "Temperatura",
        filterable: false,
        cellClassName: (params) => params.value > 25 ? "red" : "",
    },
    { field: "time", width: 500, filterable: false, headerName: "Fecha" },
    {
        field: "alarm",
        type: "boolean",
        width: 150,
    },

]

const Table = () => {

    const [data, setData] = useState([]);

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


    function getRows() {
        return data.flatMap((d, index) =>
            d.minutely_15.temperature_2m.map((temp, i) => ({
                id: nanoid(),
                city: "Ciudad" + (index + 1),
                temperature: temp,
                alarm: temp > 25,
                time: format(new Date(d.minutely_15.time[i]), "dd/MM/yyyy HH:mm"),

            }))
        );
    }

    return (
        <div style={{ height: 300, width: '100%' }}>
            <DataGrid rows={getRows()} columns={COLUMNS_DEFINITION} loading={loading}
                onFilterModelChange={(model) => console.log(model)}

                initialState={{
                    columns: {
                        columnVisibilityModel: {

                            id: false,
                            alarm: false

                        },
                    },


                }
                } />
        </div>
    )
}

export default Table