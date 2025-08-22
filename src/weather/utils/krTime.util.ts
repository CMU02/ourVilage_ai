export const getKrTime = () => {
    // 한국 시간(KST, UTC+9)으로 현재 시간 가져오기
    const now = new Date();

    // 한국 시간대로 변환
    const kstTime = new Date(now.toLocaleString("en-US", { timeZone: "Asia/Seoul" }));

    // YYYY-MM-DDTHH:mm:ss 형태로 포맷팅
    const year = kstTime.getFullYear();
    const month = String(kstTime.getMonth() + 1).padStart(2, '0');
    const day = String(kstTime.getDate()).padStart(2, '0');
    const hours = String(kstTime.getHours()).padStart(2, '0');
    const minutes = String(kstTime.getMinutes()).padStart(2, '0');
    const seconds = String(kstTime.getSeconds()).padStart(2, '0');

    return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`;
}