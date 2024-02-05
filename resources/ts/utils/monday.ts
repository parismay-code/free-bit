const monday = () => {
    const now = new Date();
    const first = now.getDate() - now.getDay() + 1;

    return new Date(now.setDate(first));
};

export default monday;
