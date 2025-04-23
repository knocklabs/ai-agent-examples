import { useState, useRef } from "react";
import {
  NotificationIconButton,
  NotificationFeedPopover,
  useKnockFeed,
} from "@knocklabs/react";

// Required CSS import, unless you're overriding the styling
import "@knocklabs/react/dist/index.css";

const Notifications = () => {
  const [isVisible, setIsVisible] = useState(false);
  const notifButtonRef = useRef<HTMLButtonElement>(null);

  const { feedClient } = useKnockFeed();

  return (
    <div className="notifications-container">
      <div className="notifications-button">
        <NotificationIconButton
          ref={notifButtonRef}
          onClick={(e) => setIsVisible(!isVisible)}
        />
      </div>
      {notifButtonRef.current && (
        <NotificationFeedPopover
          buttonRef={notifButtonRef as React.RefObject<HTMLElement>}
          isVisible={isVisible}
          onClose={() => setIsVisible(false)}
          onNotificationButtonClick={(item) => {
            feedClient.markAsArchived(item);
            return false;
          }}
        />
      )}
    </div>
  );
};

export default Notifications;
