CS2 tournament managment solution with a lot planned in future.

Now it's just a testing facility and a way for me to keep all code in one place.

Planned and done:

1. CS2 servers control
    - A dashboard of servers containing cards of all the added servers
        on click of adding a new one it should generate a cfg file that needs to be put in cfg folder before game/server start
    - In server card live server data (map, state, scores, players, bots etc)
    - RCON lib integration for live server managment right from dashboard
        - setting warmup of certain duration or infinite
        - kick players, bots, add new ones
        - a mini map with players positions
        - change max rounds
        - enable of disable side switching
        - backing up scores of a match, restoring backups
        - launching maps, custom workshop maps
        - sending custom commands

2. OBS websocket control
    - stream automation scene scheduling system
        almost node like setup, having ability to trigger anything based on time and anything that's being send to server

3. Tournamnet managment system itself
    - Custom bracket support
        With ability to predefine structure, set custom progression rules, scores, stages
    - Editor for brackets
    - Deep integration with server contol and obs control
        Triggering bracket progression based on game's state, triggering server and obs commands based on progression or schedule of tournament

I'll implement more from here
https://www.reddit.com/r/GlobalOffensive/comments/cjhcpy/game_state_integration_a_very_large_and_indepth/

Yeah via sending with throttle of 0.005 and same buffer I put straign on network, but it should be managable for lan environments with only one instance running this software