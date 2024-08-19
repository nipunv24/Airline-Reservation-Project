import React from "react";
import "./AboutUs.css";

const AboutUs = () => {
  return (
    <div className="AboutUsTag">
      <div className="AboutUsContainer">
        <h1 className="GroupNumber">Group 19</h1>
        <h2 className="Members">Members</h2>
        <table className="NameTable">
          <tbody className="NamesBody">
            <tr>
              <td>1.</td>
              <td>Harismenan J.</td>
              <td>210207E</td>
            </tr>
            <tr>
              <td>2.</td>
              <td>Nayanathara P.M.C.</td>
              <td>210417X</td>
            </tr>
            <tr>
              <td>3.</td>
              <td>Premarathna B.A.N.V.</td>
              <td>210495G</td>
            </tr>
            <tr>
              <td>4.</td>
              <td>Vaheshan E.</td>
              <td>210665E</td>
            </tr>
            <tr>
              <td>5.</td>
              <td>Wickramasinghe V.L.A.</td>
              <td>210710N</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AboutUs;
