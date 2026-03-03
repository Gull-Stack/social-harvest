"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Search, PenSquare, ArrowDown, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { getConversations, getOrCreateDM } from "@/server/actions/conversations";
import { useDM } from "@/hooks/use-dm";
import { ChatMessage } from "@/components/chat/ChatMessage";
import { ChatComposer } from "@/components/chat/ChatComposer";
import { ChatDateDivider } from "@/components/chat/ChatDateDivider";
import { isSameDay, differenceInMinutes, formatDistanceToNow } from "date-fns";
import type { ChatMessage as ChatMessageType } from "@/hooks/use-chat";

interface UserProfile {
  id: string;
  username: string;
  displayName: string | null;
  avatarUrl: string | null;
}

interface ConversationItem {
  id: string;
  updatedAt: string;
  otherUser: UserProfile | null;
  lastMessage: {
    id: string;
    content: string;
    createdAt: string;
    authorId: string;
  } | null;
}

interface MessagesViewProps {
  currentUser: UserProfile | null;
  members: UserProfile[];
  initialDmUserId?: string;
}

export function MessagesView({ currentUser, members, initialDmUserId }: MessagesViewProps) {
  const [conversations, setConversations] = useState<ConversationItem[]>([]);
  const [activeConvoId, setActiveConvoId] = useState<string | null>(null);
  const [activeOtherUser, setActiveOtherUser] = useState<UserProfile | null>(null);
  const [isLoadingConvos, setIsLoadingConvos] = useState(true);
  const [showNewMessage, setShowNewMessage] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showScrollDown, setShowScrollDown] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const isNearBottom = useRef(true);

  const {
    messages,
    isLoading: isLoadingMessages,
    hasMore,
    sendMessage,
    loadMore,
  } = useDM(activeConvoId, currentUser?.id);

  // Auto-open DM if initialDmUserId provided (from member card click)
  useEffect(() => {
    if (!initialDmUserId || !currentUser) return;
    const targetUser = members.find((m) => m.id === initialDmUserId);
    if (targetUser) {
      startConversation(targetUser);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialDmUserId]);

  // Load conversations
  useEffect(() => {
    async function load() {
      setIsLoadingConvos(true);
      try {
        const convos = await getConversations();
        setConversations(convos as ConversationItem[]);
      } catch (err) {
        console.error("Failed to load conversations:", err);
      } finally {
        setIsLoadingConvos(false);
      }
    }
    load();
  }, []);

  // Auto-scroll on new messages
  useEffect(() => {
    if (isNearBottom.current) {
      bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  useEffect(() => {
    if (!isLoadingMessages && activeConvoId) {
      bottomRef.current?.scrollIntoView();
    }
  }, [isLoadingMessages, activeConvoId]);

  const handleScroll = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    const distFromBottom = el.scrollHeight - el.scrollTop - el.clientHeight;
    isNearBottom.current = distFromBottom < 100;
    setShowScrollDown(distFromBottom > 300);
    if (el.scrollTop < 50 && hasMore) loadMore();
  }, [hasMore, loadMore]);

  async function startConversation(otherUser: UserProfile) {
    try {
      const convoId = await getOrCreateDM(otherUser.id);
      setActiveConvoId(convoId);
      setActiveOtherUser(otherUser);
      setShowNewMessage(false);
      // Refresh conversation list
      const convos = await getConversations();
      setConversations(convos as ConversationItem[]);
    } catch (err) {
      console.error("Failed to start conversation:", err);
    }
  }

  function selectConversation(convo: ConversationItem) {
    setActiveConvoId(convo.id);
    setActiveOtherUser(convo.otherUser);
    setShowNewMessage(false);
  }

  function getInitials(user: UserProfile | null) {
    const name = user?.displayName || user?.username || "?";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  }

  function shouldGroup(msg: ChatMessageType, prev: ChatMessageType | undefined): boolean {
    if (!prev) return false;
    if (prev.authorId !== msg.authorId) return false;
    return differenceInMinutes(new Date(msg.createdAt), new Date(prev.createdAt)) < 5;
  }

  function needsDateDivider(msg: ChatMessageType, prev: ChatMessageType | undefined): boolean {
    if (!prev) return true;
    return !isSameDay(new Date(msg.createdAt), new Date(prev.createdAt));
  }

  const filteredMembers = members.filter((m) => {
    const q = searchQuery.toLowerCase();
    return (
      m.username.toLowerCase().includes(q) ||
      (m.displayName?.toLowerCase().includes(q) ?? false)
    );
  });

  return (
    <div className="flex h-[calc(100vh-4rem)] overflow-hidden">
      {/* Conversation List */}
      <div className="w-80 flex-shrink-0 border-r border-gray-200 bg-white flex flex-col">
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
          <h2 className="text-sm font-semibold">Messages</h2>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={() => setShowNewMessage(!showNewMessage)}
          >
            <PenSquare className="h-4 w-4" />
          </Button>
        </div>

        {/* New message search */}
        {showNewMessage && (
          <div className="p-3 border-b border-gray-100">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
              <Input
                placeholder="Search members..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 h-9 text-sm"
                autoFocus
              />
            </div>
            {searchQuery && (
              <div className="mt-2 max-h-48 overflow-y-auto">
                {filteredMembers.map((member) => (
                  <button
                    key={member.id}
                    onClick={() => startConversation(member)}
                    className="flex items-center gap-3 w-full px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors text-left"
                  >
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={member.avatarUrl || undefined} />
                      <AvatarFallback className="text-xs">
                        {getInitials(member)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="min-w-0">
                      <p className="text-sm font-medium truncate">
                        {member.displayName || member.username}
                      </p>
                      <p className="text-xs text-muted-foreground truncate">
                        @{member.username}
                      </p>
                    </div>
                  </button>
                ))}
                {filteredMembers.length === 0 && (
                  <p className="text-xs text-muted-foreground px-3 py-2">
                    No members found
                  </p>
                )}
              </div>
            )}
          </div>
        )}

        {/* Conversation list */}
        <ScrollArea className="flex-1">
          {isLoadingConvos ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
            </div>
          ) : conversations.length === 0 ? (
            <div className="px-4 py-8 text-center">
              <p className="text-sm text-muted-foreground">No messages yet</p>
              <p className="text-xs text-muted-foreground mt-1">
                Click the pen icon to start a conversation
              </p>
            </div>
          ) : (
            conversations.map((convo) => (
              <button
                key={convo.id}
                onClick={() => selectConversation(convo)}
                className={cn(
                  "flex items-center gap-3 w-full px-4 py-3 hover:bg-gray-50 transition-colors text-left border-b border-gray-50",
                  activeConvoId === convo.id && "bg-gray-50"
                )}
              >
                <Avatar className="h-10 w-10 shrink-0">
                  <AvatarImage src={convo.otherUser?.avatarUrl || undefined} />
                  <AvatarFallback className="text-xs">
                    {getInitials(convo.otherUser)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium truncate">
                      {convo.otherUser?.displayName || convo.otherUser?.username || "Unknown"}
                    </p>
                    {convo.lastMessage && (
                      <span className="text-[10px] text-muted-foreground shrink-0 ml-2">
                        {formatDistanceToNow(new Date(convo.lastMessage.createdAt), {
                          addSuffix: false,
                        })}
                      </span>
                    )}
                  </div>
                  {convo.lastMessage && (
                    <p className="text-xs text-muted-foreground truncate mt-0.5">
                      {convo.lastMessage.authorId === currentUser?.id ? "You: " : ""}
                      {convo.lastMessage.content}
                    </p>
                  )}
                </div>
              </button>
            ))
          )}
        </ScrollArea>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col bg-white">
        {activeConvoId && activeOtherUser ? (
          <>
            {/* DM Header */}
            <div className="flex items-center gap-3 border-b border-gray-200 px-5 py-3">
              <Avatar className="h-9 w-9">
                <AvatarImage src={activeOtherUser.avatarUrl || undefined} />
                <AvatarFallback className="text-xs">
                  {getInitials(activeOtherUser)}
                </AvatarFallback>
              </Avatar>
              <div>
                <h3 className="text-sm font-semibold">
                  {activeOtherUser.displayName || activeOtherUser.username}
                </h3>
                <p className="text-xs text-muted-foreground">
                  @{activeOtherUser.username}
                </p>
              </div>
            </div>

            {/* Messages */}
            <div
              ref={scrollRef}
              className="flex-1 overflow-y-auto relative"
              onScroll={handleScroll}
            >
              {hasMore && (
                <div className="flex justify-center py-4">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={loadMore}
                    className="text-xs text-muted-foreground"
                  >
                    Load older messages
                  </Button>
                </div>
              )}

              {isLoadingMessages ? (
                <div className="flex h-full items-center justify-center">
                  <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                </div>
              ) : messages.length === 0 ? (
                <div className="flex h-full flex-col items-center justify-center gap-3 px-4 text-center">
                  <Avatar className="h-16 w-16">
                    <AvatarImage src={activeOtherUser.avatarUrl || undefined} />
                    <AvatarFallback>
                      {getInitials(activeOtherUser)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="text-lg font-semibold">
                      {activeOtherUser.displayName || activeOtherUser.username}
                    </h3>
                    <p className="mt-1 text-sm text-muted-foreground">
                      This is the start of your conversation. Say hi!
                    </p>
                  </div>
                </div>
              ) : (
                <div className="py-2">
                  {messages.map((msg, i) => {
                    const prev = i > 0 ? messages[i - 1] : undefined;
                    const showDivider = needsDateDivider(msg, prev);
                    const isGrouped = !showDivider && shouldGroup(msg, prev);

                    return (
                      <div key={msg.id}>
                        {showDivider && (
                          <ChatDateDivider date={new Date(msg.createdAt)} />
                        )}
                        <ChatMessage
                          message={msg}
                          currentUserId={currentUser?.id}
                          isGrouped={isGrouped}
                        />
                      </div>
                    );
                  })}
                </div>
              )}

              <div ref={bottomRef} />
            </div>

            {showScrollDown && (
              <div className="absolute bottom-20 right-6">
                <Button
                  size="icon"
                  variant="secondary"
                  className="h-9 w-9 rounded-full shadow-lg"
                  onClick={() =>
                    bottomRef.current?.scrollIntoView({ behavior: "smooth" })
                  }
                >
                  <ArrowDown className="h-4 w-4" />
                </Button>
              </div>
            )}

            <ChatComposer
              onSend={async (content) => {
                await sendMessage(content);
              }}
              placeholder={`Message ${activeOtherUser.displayName || activeOtherUser.username}`}
              disabled={!currentUser}
            />
          </>
        ) : (
          <div className="flex h-full items-center justify-center">
            <div className="text-center">
              <h3 className="text-lg font-semibold text-gray-400">Your Messages</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                Select a conversation or start a new one
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
