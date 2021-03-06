import { useEffect, useState } from "react";
import ConferenceHall from "../services/ConferenceHall";
import TalkModel, { Speaker } from "../classes/TalkModel";
import EventModel from "../classes/EventModel";

const LOCAL_STORAGE_TALKS_KEY = "ces-2019-talks";

function filterSelectedTalks(program, conferenceHall) {
  const selectedTalks = [];

  // Logic for conference hall talks
  conferenceHall.talks.forEach(talk => {
    program.talks.forEach(t => {
      if (talk.id === t.id) {
        const speakers = conferenceHall.speakers
          .filter(speaker => talk.speakers.includes(speaker.uid))
          .map(speaker => new Speaker(speaker));

        const formats = conferenceHall.formats
          .filter(format => format.id === talk.formats)
          .map(format => format.name)[0];

        const formattedTalk = new TalkModel(
          talk.id,
          t.title || talk.title,
          t.state || talk.state,
          t.level || talk.level,
          t.abstract || talk.abstract,
          t.categories || talk.categories,
          t.formats || formats,
          t.speakers || speakers,
          t.room,
          t.hour
        );
        selectedTalks.push(formattedTalk);
      }
    });
  });

  // Logic for special events
  program.talks.forEach(t => {
    if (t.state === "event") {
      const event = new EventModel(
        t.id,
        t.title,
        t.state,
        t.abstract,
        t.room,
        t.hour
      );

      selectedTalks.push(event);
    }
  });

  // Logic for sponsors and keynotes
  program.talks.forEach(t => {
    if (t.state === "sponsors" || t.state === "keynotes") {
      const special = Object.assign({}, t);
      selectedTalks.push(special);
    }
  });

  return selectedTalks;
}

export const useTalks = () => {
  const [talks, setTalks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      const program = await ConferenceHall.getProgram();
      const data = await ConferenceHall.getData();
      const selectedTalks = filterSelectedTalks(program, data);
      localStorage.setItem(
        LOCAL_STORAGE_TALKS_KEY,
        JSON.stringify(selectedTalks)
      );
      setTalks(selectedTalks);
      setLoading(false);
    }

    // const selectedTalks = localStorage.getItem(LOCAL_STORAGE_TALKS_KEY);

    // if (selectedTalks === null || selectedTalks === "") {
    //   fetchData();
    // } else {
    //   setTalks(JSON.parse(selectedTalks));
    //   setLoading(false);
    // }
    fetchData();
  }, [setTalks, setLoading]);

  return [talks, loading];
};
