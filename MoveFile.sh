    #!/bin/bash

    SOURCE_PATH="/Users/jessicapetrochuk/Downloads/transcript.txt"
    DESTINATION_PATH="./data"
    SCRIPT_TO_TRIGGER="./src/summarizer_and_classifier/process_cli.js"

    while true; do
    if [ -f "$SOURCE_PATH" ]; then
        # Move the file to the destination directory
        mv "$SOURCE_PATH" "$DESTINATION_PATH"
        echo "File moved successfully."

        # Run the Node.js script
        echo "Running Node.js script..."
        node "$SCRIPT_TO_TRIGGER" --file "$DESTINATION_PATH"
        echo "Script executed."

        break  # Exit the loop after processing
    fi
    sleep 1  # Wait a second before checking again
done

    