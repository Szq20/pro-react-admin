
const getFileType = (blob: Blob) => {
    const file = new Blob([blob]);
    return file.type;
};

export {
    getFileType
};