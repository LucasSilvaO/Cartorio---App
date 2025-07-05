export const formatDate = (dateString) => {
    const [year, month, day] = dateString.split('-');
    return `${day}/${month}/${year}`;
};

export const calculateDaysDifference = (date1, date2) => {
    const date1InMs = new Date(date1).getTime();
    const date2InMs = new Date(date2).getTime();
    const differenceInMs = date2InMs - date1InMs;
    return Math.ceil(differenceInMs / (1000 * 60 * 60 * 24));
}

export const formatDateTime = (isoString) => {
    const date = new Date(isoString);
    
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Mês é baseado em zero
    const year = date.getFullYear();
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');

    return `${day}/${month}/${year}-${hours}:${minutes}`;
}