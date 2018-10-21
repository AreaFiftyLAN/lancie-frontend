import {html} from '../../node_modules/lit-html/lit-html.js';

export const template = html`
<img width="100%" src="images/banner/banner.jpg" />

<section>
    <h2>Area FiftyLAN</h2>
    <p>
    Area FiftyLAN is the annual gaming event held at the TU Delft. From 2 till 4 March
    more than 200 gamers will spend the weekend having a blast playing games
    together. It is organized by the study assosciation of Applied
    Mathematics and Computer Science &amp; Engineering, W.I.S.V. ‘Christiaan Huygens',
    in cooperation with the Unit Sports &amp; Culture, TU Delft. All students are
    welcome to bring their PCs to play their favourite games with their friends.
    There will be official tournaments where you can win amazing prizes. Besides the
    official tournaments, you can team up and have fun with more casual games as well
    or organize your own tournament.
    </p>
    <p>
    If you are no hardcore gamer, don’t worry. There are also enough offline-games
    to play with. Think about arcade cabinets, retro consoles and board games. More
    information about the event will be published at a later date.
    </p>
</section>

<section>
    <h2>Activities</h2>
    <p>
    There are multiple official tournaments that will be organized by the committee.
    These tournaments feature large prize pools, so expect the competition to
    be fierce. If your favorite game is not listed here do not worry, you can organize
    your own! Contact us to get the ball rolling, more information on how to do that is
    found below.
    </p>

    <div class="dynamic-activities">
    <lancie-activities location="data/official-tournaments.json?ver=1.1.2"></lancie-activities>
    
    <noscript>
        Please enable JavaScript to see the overview of activities that will be hosted on the LAN.
    </noscript>
    </div>
</section>
`;