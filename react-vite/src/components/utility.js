const calculateKidAge = (birth_date) => {

    const now = new Date();
    const birth = new Date(birth_date);

    let years = now.getFullYear() - birth.getFullYear();
    let months = now.getMonth() - birth.getMonth();
    let days = now.getDate() - birth.getDate();

    if (days < 0) {
        months--;
        days += new Date(now.getFullYear(), now.getMonth(), 0).getDate();
    }
    if (months < 0) {
        years--;
        months += 12;
    }

    return `${years} Year  ${months} Months ${days} Days`;
};

export default calculateKidAge;