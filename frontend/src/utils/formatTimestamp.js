export const formatTimestamp = (isoString) => {
    if (!isoString) return "";
    try {
        const date = new Date(isoString);
        return date.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit', hour12: true });
    } catch (error) {
        console.error("Error formatting timestamp:", error, isoString);
        return "Invalid time";
    }
};