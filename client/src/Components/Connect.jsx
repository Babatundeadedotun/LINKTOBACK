import React, { useEffect, useState } from "react";
import axios from "axios";

const Connect = () => {
    const [item, setitem] = useState("");
    const [model, setmodel] = useState("");
    const [price, setprice] = useState("");
    const [list, setList] = useState([]);
    const [loading, setloading] = useState(true)
    const [editingItemId, setEditingItemId] = useState(null)
    const [editData, setEditData] = useState({item: '', model: '', price: ''})

    // const endpoint = "http://localhost:8000/cars"

    const url = "http://localhost:8000/submit";

    const url_db = "http://localhost:8000/data";

    const fetchData = async () => {
        try {
            const response = await axios.get(url_db);
            console.log(response);
            if (response.data) {
                setList(response.data);
                console.log(response.data);
            } else {
                console.log("No data found");
            }
        } catch (error) {
            console.error(error);
        } finally {
            setloading(false);
        }
        
    };


        const deleteItem = async (id) => {
            try {
                const response = await axios.delete(`http://localhost:8000/data/${id}`);
                if(response.status === 200) {
                    setList(list.filter((item) => item._id !== id));
                    alert(`Item deleted successfully`);
                } else {
                    console.error("Failed to delete item", response.status);
                }
                
            } catch (error) {
                console.error("Error deleting item:", error);
            }
        }

        // const handleEditClick = (user) => {
        //     setEditingItemId(user._id);
        //     setEditData({item: user.item, model: user.model, price: user.price});
        // }

        // const handleEditChange = (e) => {
        //     const {name, value} = e.target;
        //     setEditData((prevData) => ({...prevData, [name]: value}));
        // }

        // const submitEdit = async () => {
        //     try {
        //         const response = await axios.put(`http://localhost:8000/data/${editingItemId}`, editData);
        //         if (response.status === 2000) {
        //             setList(list.map((item) => (item._id === editingItemId ? response.data : item)));
        //             setEditingItemId(null);
        //         } else {
        //             console.error("Failed to update item", response.status);
        //         }
        //     } catch (error) {
        //         console.error("Error updating item:", error);
        //     }
        // }

    useEffect(() => {
        fetchData();
    }, []);

    const submitInfo = () => {
        if (item === "" || model === "" || price === "") {
            alert("Please complete the form");
        } else {
            let obj = {
                item: item,
                model: model,
                price: price,
            };
            axios.post(url, obj)
                .then((response) => {
                    console.log(response.data);
                })
                .catch((error) => {
                    console.log(error);
                });
        }
    };



    return (
        <>
        <div className="mx-auto align-center">
            <h1>Connecting Frontend/Backend to Database</h1>
            <form action="" className="form-control p-3 mb-4 mt-5 mx-auto w-50">
            <input type="text" className="mb-3 form-control mx-auto" placeholder="Enter an Item" name="item" value={item} onChange={(e) => {setitem(e.target.value);}}/>
            <br />
            <input type="text" className="mb-3 form-control mx-auto" placeholder="Enter a Model" name="model" value={model} onChange={(e) => {setmodel(e.target.value);}}/>
            <br />
            <input type="text" className="form-control mx-auto" placeholder="Enter a Price" name="price" value={price} onChange={(e) => {setprice(e.target.value);}}/>
            <br />
            <br />
            <button className="btn btn-primary w-50" onClick={submitInfo}>Submit</button>
            </form>

            <h2>Fetched Data:</h2>

            {

            loading ? (
                <p>Loading data...</p>
            ) : list.length === 0 ? (
                <p>No data found</p>
            ) : 

            <table className="table w-100 table-bordered">
            <thead>
                <tr>
                <th scope="col">S/N</th>
                <th scope="col">ITEM</th>
                <th scope="col">MODEL</th>
                <th scope="col">PRICE</th>
                <th scope="col">ACTION</th>
                </tr>
            </thead>
            <tbody>
        
             {
                
                list.map((item, index) => (
                    <tr key={index}>
                        <th scope="row">{index+1}</th>
                        <td>{item.item}</td>
                        <td>{item.model}</td>
                        <td>{item.price}</td>
                        <td>
                            <button className="btn btn-danger me-2" onClick={() => deleteItem(item._id)}>Delete</button>
                            <button className="btn btn-primary ms-2 w-25" onClick={() => handleEditClick(item)}>Edit</button>
                        </td>
                    </tr>
                ))
            }

            </tbody>
            </table>
            
            }


        </div>
        </>
    );
};

export default Connect;
