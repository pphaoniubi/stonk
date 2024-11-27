import React, { useState, useEffect } from "react";

function FundamentalPage() {
    const [fundamentals, setFundamentals] = useState([]);
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        fetchAllFundamental();
    }, []);

    async function fetchAllFundamental() {
        try {
            setIsLoading(true);
            const response = await fetch("http://127.0.0.1:8000/stock/stockAllFundamentals", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
            });
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            const data = await response.json();
            setFundamentals(data || []);
        } catch (err) {
            console.error("Error fetching fundamentals:", err);
            setError("Failed to load data. Please try again later.");
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <div>
            <h1>Stock Fundamentals (sort by market cap)</h1>
            {error ? (
                <p style={{ color: "red" }}>{error}</p>
            ) : isLoading ? (
                <p>Loading...</p>
            ) : fundamentals.length > 0 ? (
                <table border="1" style={{ borderCollapse: "collapse", width: "100%" }}>
                    <thead>
                        <tr>
                            {Object.keys(fundamentals[0]).map((key) => (
                                <th key={key}>{key}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {fundamentals.map((item) => (
                            <tr key={item.id}>
                                {Object.values(item).map((value, index) => (
                                    <td key={`${item.id}-${index}`}>{value}</td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            ) : (
                <p>No data available.</p> // Message when `fundamentals` is empty
            )}
        </div>
    );
}

export default FundamentalPage;
