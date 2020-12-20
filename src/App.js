import React, { useState, useEffect } from 'react';

import Image from 'react-bootstrap/Image';
import Jumbotron from 'react-bootstrap/Jumbotron';
import ListGroup from 'react-bootstrap/ListGroup';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';

import './App.css';

const App = () => {

  const [golfDays, setGolfDays] = useState([]);

  useEffect(() => {
    const bookingDaysUrl = "https://www.eventbrite.co.uk/o/westonbirt-leisure-16812056330";
    let xhr = new XMLHttpRequest();
    xhr.open("GET", "https://cors-anywhere.herokuapp.com/" + bookingDaysUrl);
    xhr.send();
    xhr.onload = function() {
      if (xhr.status != 200) {
        console.log('Error');
      } else { 
        var el = document.createElement('html');
        el.innerHTML = xhr.response;
        buildListOfDayBookings(el);
      }
    };
  }, []);

  const getTodaysDayNumber = () => {
    var d = new Date();    
    if (d.getDay == 0) return 7; // hack for ordering etc...
    return d.getDay();
  }

  const getDayNumber = (day) => {
      if(day == "Monday") return 1;
      if(day == "Tuesday") return 2;
      if(day == "Wednesday") return 3;
      if(day == "Thursday") return 4;
      if(day == "Friday") return 5;
      if(day == "Saturday") return 6;
      if(day == "Sunday") return 7;
  }
  const buildListOfDayBookings = (el) => {
    const tags = el.getElementsByTagName("a");
    Object.keys(tags).map((t) => {
      if (tags[t].getAttribute('class') == 'eds-event-card-content__action-link') {
        let title;
        let day;
        document.createElement('div').innerHTML = tags[t].innerHTML;
        const divs = tags[t].querySelectorAll('div');
        Object.keys(divs).map((d) => {
          if (divs[d].getAttribute('class') == 'eds-is-hidden-accessible') {
            title = divs[d].innerText;
            day = title.split('-')[1].split('(')[0].trim();
          }
        });
        const url = tags[t].getAttribute('href');
        if (day && title && url) {
          const entry = {
            day: day,
            dayNumber: getDayNumber(day),
            title: title,
            url: url
          };              
          setGolfDays(golfDays => [...golfDays, entry]);              
        }
      }
    });
  };

  const getDayLink = (g) => {
    if (getTodaysDayNumber() == g.dayNumber) {
      return (
        <a style={{color: '#f88c00'}} href={ g.url }>{ g.day }</a>
      );
    } else {
      return (
        <a style={{color: '#202020'}} href={ g.url }>{ g.day }</a>
      );
    }
  }
  
  const orderedDays = golfDays.sort((a, b) => a.dayNumber-b.dayNumber);
  const comps = orderedDays.map((g, index) => {
    return (
      <ListGroup.Item key={ index }>
        { getDayLink(g) }
      </ListGroup.Item>
    );
  })

  return (
    <Container className="p-3">
      <Jumbotron>
        <h1 className="header">Westonbirt Golf Booking</h1>        
        <Container>
          <Row className="justify-content-md-center">
            <h6><a style={{color: 'grey'}} href='https://www.westonbirtgolfclub.co.uk/'>About Westonbirt Golf Club</a></h6>
          </Row>
          <Row className="justify-content-md-center">
            <Image src='./aerial.png' width='300px'/>
          </Row>
        </Container>
        <ListGroup style={{marginTop: 20}}>
          {/* { comps }           */}
        </ListGroup>
      </Jumbotron>
    </Container>
  );
}

export default App;
