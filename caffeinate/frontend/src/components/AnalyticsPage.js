import '../styling/AnalyticsPage.css';

export default function AnalyticsPage() {
    return (
        <div className="analytics">
            <div className="journal-section">
                Your Journal Entries
                word cloud
            </div>

            <div className="survey-section">
                Your Survey Responses
                <div className="survey-section_sub">
                    Your Daily Ratings
                    line graph
                </div>
                <div className="survey-section_sub">
                    Your Daily Selfies
                    bar graph
                </div>
            </div>
        </div>
    );
};