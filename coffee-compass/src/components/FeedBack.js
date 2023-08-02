import React from 'react';

const FeedBack = () => {
  return (
    <div className="wrap">
      <div className="content">
        <div className="contact_desc">
          <div className="contact-form">
            <h2>Contact Us</h2>
            <form method="post" action="contact-post.html" className="left_form">
              <div>
                <span><label>NAME</label></span>
                <span><input name="userName" type="text" className="textbox" /></span>
              </div>
              <div>
                <span><label>E-MAIL</label></span>
                <span><input name="userEmail" type="text" className="textbox" /></span>
              </div>
              <div>
                <span><label>Fax</label></span>
                <span><input name="userPhone" type="text" className="textbox" /></span>
              </div>
            </form>
            <form className="right_form">
              <div>
                <span><label>SUBJECT</label></span>
                <span><textarea name="userMsg" /></span>
              </div>
              <div>
                <span><input type="submit" value="Submit" className="myButton" /></span>
              </div>
            </form>
            <div className="clear" />
          </div>
          <div className="content_bottom">
            <div className="company_address">
              <h2>Location</h2>
              <p>239 E 5th St, Brooklyn,</p>
              <p> NY 11217,</p>
              <p>USA</p>
              <p>Phone:(353) 123 456 789</p>
              <p>Fax: (000) 000 00 00 0</p>
              <p>Email: <span><a href="mailto:info@mycompany.com">info(at)CoffeeCompass.com</a></span></p>
              <p>Follow on: <span><a href="#">Facebook</a></span>, <span><a href="#">Twitter</a></span></p>
            </div>
            <div className="contact_info">
              <h2>Find Us Here</h2>
              <div className="map">
                <iframe
                  width="100%"
                  height="200"
                  frameBorder="0"
                  scrolling="no"
                  marginHeight="0"
                  marginWidth="0"
                  src="https://maps.google.co.in/maps?f=q&amp;source=s_q&amp;hl=en&amp;geocode=&amp;q=Lighthouse+Point,+FL,+United+States&amp;aq=4&amp;oq=light&amp;sll=26.275636,-80.087265&amp;sspn=0.04941,0.104628&amp;ie=UTF8&amp;hq=&amp;hnear=Lighthouse+Point,+Broward,+Florida,+United+States&amp;t=m&amp;z=14&amp;ll=26.275636,-80.087265&amp;output=embed"
                />
                <br />
                <small>
                  <a
                    href="https://maps.google.co.in/maps?f=q&amp;source=embed&amp;hl=en&amp;geocode=&amp;q=Lighthouse+Point,+FL,+United+States&amp;aq=4&amp;oq=light&amp;sll=26.275636,-80.087265&amp;sspn=0.04941,0.104628&amp;ie=UTF8&amp;hq=&amp;hnear=Lighthouse+Point,+Broward,+Florida,+United+States&amp;t=m&amp;z=14&amp;ll=26.275636,-80.087265"
                    style={{ color: '#8C8061', textAlign: 'left', fontSize: '0.85em' }}
                  >
                    View Larger Map
                  </a>
                </small>
              </div>
            </div>
            <div className="clear" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeedBack;
