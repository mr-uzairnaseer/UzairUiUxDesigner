const fs = require('fs');
let appJsx = fs.readFileSync('src/App.jsx', 'utf8');

const oldCard = [
  '            <div className="ap-edu-card sr-group">',
  '              <span className="ap-tag-pill sr-child" style={{ "--i": 0 }}>',
  '                <GraduationCap size={13} /> education',
  '              </span>',
  '              <h3 className="sr-child" style={{ "--i": 1 }}>BS Computer Science</h3>',
  '              <div className="ap-school sr-child" style={{ "--i": 2 }}>Quaid-I-Azam University<br/>Islamabad</div>',
  '              <div className="ap-edu-row sr-child" style={{ "--i": 3 }}>',
  '                <span>Graduated</span><b>2025</b>',
  '              </div>',
  '              <div className="ap-edu-row ap-edu-row-last sr-child" style={{ "--i": 4 }}>',
  '                <span>Experience</span><b>1 Year</b>',
  '              </div>',
  '            </div>'
].join('\\n');

const newCards = [
  '            <div className="ap-edu-cards sr-group">',
  '              <div className="ap-edu-card sr-child" style={{ "--i": 0 }}>',
  '                <span className="ap-tag-pill">',
  '                  <GraduationCap size={13} /> education',
  '                </span>',
  '                <h3>BS Computer Science</h3>',
  '                <div className="ap-school" style={{ marginBottom: "0" }}>Quaid-I-Azam University<br/>Islamabad, 2025</div>',
  '              </div>',
  '              <div className="ap-edu-card sr-child" style={{ "--i": 1 }}>',
  '                <span className="ap-tag-pill">',
  '                  <Briefcase size={13} /> experience',
  '                </span>',
  '                <h3>Tech Web Ninja</h3>',
  '                <div className="ap-school">UI/UX Designer</div>',
  '                <div className="ap-edu-row">',
  '                  <span>Duration</span><b>1 Year</b>',
  '                </div>',
  '                <div className="ap-edu-row ap-edu-row-last">',
  '                  <span>MMSC</span><b>3 Months (Intern)</b>',
  '                </div>',
  '              </div>',
  '            </div>'
].join('\\n');

appJsx = appJsx.replace(oldCard, newCards);
fs.writeFileSync('src/App.jsx', appJsx, 'utf8');
