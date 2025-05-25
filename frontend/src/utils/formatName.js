export const truncateName = (name, maxLength = 15) => {
    if (!name) return "";
    if (name.length <= maxLength) {
        return name;
    }
    return name.substring(0, maxLength).trim() + "...";
};