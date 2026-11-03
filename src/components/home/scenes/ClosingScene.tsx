import { useEffect, useRef, useState, type MouseEvent } from "react";
import { EnquiryDialog } from "@/components/home/EnquiryDialog";
import { COIL_START, LooseEnd, type Point } from "@/components/home/LooseEnd";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { scrollToSection } from "@/lib/smooth-scroll";
import { Place, Port, Scene, SceneHeadline } from "@/components/services/worlds/World";

/*
 * The end of the page: the thread that has run through every section stops here as a loose
 * end, a live coil of thread (LooseEnd). Pull it and it unwinds, then the same line flies into
 * a frame and the enquiry form opens inside it (EnquiryDialog): the journey down the page
 * becomes the start of a project. Start a Project, or Enter on the thread's end, pulls it for
 * you. Without a script, Start a Project is a plain link to the contact page.
 */
const LOOSE_END = { x: 54, y: 13, w: 36 };

export function ClosingScene() {
    const [open, setOpen] = useState(false);
    const [from, setFrom] = useState<Point[] | null>(null);
    const pull = useRef<(() => void) | null>(null);

    const onPull = (points: Point[]) => {
        setFrom(points);
        setOpen(true);
    };

    // Start a Project: pull the thread where it is on screen, otherwise open the form directly.
    // Every call to action on the page lands here (this scene's Start a Project, and the
    // header's and Work's through openEnquiry): pull the thread when its loose end is on
    // screen, otherwise open the form directly.
    const enquire = useRef(() => {});
    enquire.current = () => {
        const end = document.querySelector<HTMLElement>(".loose-end");
        const live =
            Boolean(end?.closest(".thread-live")) && (end?.getClientRects().length ?? 0) > 0;
        const rect = end?.getBoundingClientRect();
        const onScreen = rect ? rect.bottom > 0 && rect.top < window.innerHeight : false;
        if (live && onScreen && pull.current) {
            pull.current();
        } else {
            setFrom(null);
            setOpen(true);
        }
    };
    useEffect(() => {
        const listen = () => enquire.current();
        window.addEventListener("classific:enquire", listen);
        return () => window.removeEventListener("classific:enquire", listen);
    }, []);
    const start = (event: MouseEvent<HTMLAnchorElement>) => {
        event.preventDefault();
        enquire.current();
    };

    return (
        <>
            <Scene
                id="closing-title"
                anchor="contact"
                tone="ink"
                exit="end"
                index="10"
                label="Start a conversation"
                description="Tell us about the challenge in front of your business."
            >
                <Place x="5%" y="18%" w="46%" still>
                    <SceneHeadline
                        id="closing-title"
                        lines={["Let's build", "what's next."]}
                        size={6}
                    />
                </Place>

                <Place x="5%" y="60%" w="34%" still>
                    <p className="max-w-md text-body-lg text-paper/75">
                        Every project starts with a loose end. Pull it, and we will take it from
                        there.
                    </p>
                    <div className="mt-8 flex flex-wrap gap-4">
                        <ButtonLink
                            to="/contact"
                            variant="inverse"
                            withArrow
                            onClick={start}
                            cursor="TALK"
                        >
                            Start a Project
                        </ButtonLink>
                        <ButtonLink
                            to="/#services"
                            variant="ghost-inverse"
                            onClick={(event) => {
                                if (scrollToSection("services")) {
                                    event.preventDefault();
                                }
                            }}
                        >
                            Explore services
                        </ButtonLink>
                    </div>
                </Place>

                {/* The loose end hangs from where the page thread stops (its first point). */}
                <Place
                    x={`${LOOSE_END.x}%`}
                    y={`${LOOSE_END.y}%`}
                    w={`${LOOSE_END.w}%`}
                    depth="flat"
                    className="loose-end-place"
                >
                    <LooseEnd onPull={onPull} pullRef={pull} away={open} />
                    <span
                        data-thread-anchor="rope-start"
                        className="absolute"
                        style={{ left: `${COIL_START.x * 100}%`, top: `${COIL_START.y * 100}%` }}
                        aria-hidden="true"
                    />
                    <Port order={2} x={`${COIL_START.x * 100}%`} y={`${COIL_START.y * 100}%`} />
                </Place>

                {/* Down the right margin and in from the right to where the coil hangs. */}
                <Port order={1} x="91%" y="16%" />
            </Scene>
            <EnquiryDialog open={open} from={from} onClose={() => setOpen(false)} />
        </>
    );
}
