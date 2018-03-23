npm ll --local --depth=0 --long=true | \
    while read line
    do
      if [[ $line = *"@"* ]] && [[ $line != *"//"* ]]; then # highlight the package title
        echo "\x1b[91m$line\x1b[0m"; # print light red using ANSI color code
      elif [[ $line = *"github"* ]]; then
        echo "\x1b[38;5;240m$line\x1b[0m";
      else
        echo "$line";
      fi;
    done;