"use client";

import { Button, message, Space } from "antd";
import {
  IoLogoWhatsapp,
  IoLogoTwitter,
  IoLogoFacebook,
  IoLink,
  IoShareSocial,
} from "react-icons/io5";
import {
  WhatsappShareButton,
  TwitterShareButton,
  FacebookShareButton,
} from "react-share";
import copy from "copy-to-clipboard";
import styles from "./ShareButtons.module.css";

interface ShareButtonsProps {
  url: string;
  title: string;
  description?: string;
}

export default function ShareButtons({
  url,
  title,
  description,
}: ShareButtonsProps) {
  const shareUrl =
    typeof window !== "undefined" ? window.location.origin + "/gallery" : url;
  const shareText = `${title}${description ? " - " + description : ""} | SLS Tournament`;

  const handleCopyLink = () => {
    copy(shareUrl);
    message.success("Link copied to clipboard!");
  };

  return (
    <div className={styles.shareButtons}>
      <h4 className={styles.title}>
        <IoShareSocial /> Share this moment
      </h4>

      <Space wrap>
        <WhatsappShareButton url={shareUrl} title={shareText}>
          <Button icon={<IoLogoWhatsapp />} className={styles.whatsappButton}>
            WhatsApp
          </Button>
        </WhatsappShareButton>

        <TwitterShareButton url={shareUrl} title={shareText}>
          <Button icon={<IoLogoTwitter />} className={styles.twitterButton}>
            Twitter
          </Button>
        </TwitterShareButton>

        <FacebookShareButton url={shareUrl} title={shareText}>
          <Button icon={<IoLogoFacebook />} className={styles.facebookButton}>
            Facebook
          </Button>
        </FacebookShareButton>

        <Button
          icon={<IoLink />}
          onClick={handleCopyLink}
          className={styles.copyButton}
        >
          Copy Link
        </Button>
      </Space>
    </div>
  );
}
