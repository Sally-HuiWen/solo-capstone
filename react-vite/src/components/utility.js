const calculateKidAgeFromBirthToNow = (birth_date) => {

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

const calculateKidAgeFromBirthToPostDate = (birth_date, created_at) => {
    const postDate = new Date(created_at);
    const birth = new Date(birth_date);
    let years = postDate.getFullYear() - birth.getFullYear();
    let months = postDate.getMonth() - birth.getMonth();
    let days = postDate.getDate() - birth.getDate();

    if (days < 0) {
        months--;
        days += new Date(postDate.getFullYear(), postDate.getMonth(), 0).getDate();
    }
    if (months < 0) {
        years--;
        months += 12;
    }

    return `${years} Year  ${months} Months ${days} Days`;
};

export { calculateKidAgeFromBirthToNow, calculateKidAgeFromBirthToPostDate };